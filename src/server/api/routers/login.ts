import { TRPCError } from "@trpc/server";
import { hash, compare } from "bcryptjs";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users, accounts } from "@/server/db/schema";
import { loginSchema } from "@/lib/validations/auth";
import { z } from "zod";

export const loginRouter = createTRPCRouter({
  // 账号密码注册
  register: publicProcedure
    .input(
      z.object({
        phone: z.string().length(11),
        password: z.string().min(6),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 检查手机号是否已存在
      const existingUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.phone, input.phone),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Phone already exists",
        });
      }

      // 创建新用户
      const hashedPassword = await hash(input.password, 12);
      const [user] = await ctx.db
        .insert(users)
        .values({
          phone: input.phone,
          name: input.name,
          phoneVerified: new Date(),
          role: "user",
        })
        .returning();

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }

      // 创建密码账号
      await ctx.db.insert(accounts).values({
        userId: user.id,
        type: "oauth",
        provider: "credentials",
        providerAccountId: user.id,
        // 存储加密后的密码
        access_token: hashedPassword,
      });

      return { user };
    }),

  // 手机号密码登录验证
  verifyCredentials: publicProcedure
    .input(loginSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { phone, password } = input;

        const user = await ctx.db.query.users.findFirst({
          where: (users, { eq }) => eq(users.phone, phone),
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "用户不存在",
          });
        }

        const account = await ctx.db.query.accounts.findFirst({
          where: (accounts, { eq, and }) =>
            and(
              eq(accounts.userId, user.id),
              eq(accounts.provider, "credentials"),
            ),
        });

        if (!account?.access_token) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "账号不存在",
          });
        }

        const isValid = await compare(password, account.access_token);
        if (!isValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "密码错误",
          });
        }

        // 返回简化的用户信息
        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role,
          },
        };
      } catch (error) {
        // 确保所有错误都被正确处理
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "登录过程中发生错误",
        });
      }
    }),
});
