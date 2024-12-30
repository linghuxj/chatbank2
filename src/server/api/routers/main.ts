import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { mains } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createCaller } from "../root";

export const mainRouter = createTRPCRouter({
  // 获取主题列表
  getList: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, userId } = input;

      try {
        const items = await ctx.db.query.mains.findMany({
          limit: limit + 1,
          where: (mains, { eq, and, gt }) => {
            const conditions = [];

            if (cursor) {
              conditions.push(gt(mains.id, cursor));
            }

            if (userId) {
              conditions.push(eq(mains.userId, userId));
            }

            return conditions.length ? and(...conditions) : undefined;
          },
          with: {
            user: true,
          },
          orderBy: [desc(mains.createdAt)],
        });

        let nextCursor: string | null = null;
        if (items.length > limit) {
          const nextItem = items.pop();
          nextCursor = nextItem!.id;
        }

        return {
          items,
          nextCursor,
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get main list",
        });
      }
    }),

  // 获取主题详情
  getById: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        const caller: any = createCaller(ctx);
        return caller.main.getByUserId();
      }
      const main = await ctx.db.query.mains.findFirst({
        where: (mains, { eq }) => eq(mains.id, input.id!),
        with: {
          user: true,
          posts: {
            where: (posts, { eq }) => eq(posts.isDeleted, false),
            with: {
              user: true,
            },
          },
        },
      });

      if (!main) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Main topic not found",
        });
      }

      // 增加浏览次数
      await ctx.db
        .update(mains)
        .set({ viewCount: main.viewCount + 1 })
        .where(eq(mains.id, main.id));

      return main;
    }),

  // 获取当前账户的主题
  getByUserId: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.query.mains.findMany({
      where: (mains, { eq }) => eq(mains.userId, ctx.session.user.id),
      with: {
        user: true,
        posts: {
          where: (posts, { eq }) => eq(posts.isDeleted, false),
          with: {
            user: true,
          },
        },
      },
      orderBy: [desc(mains.createdAt)],
    });

    const item = items.length > 0 ? items[0] : null;

    if (item) {
      // 增加浏览次数
      await ctx.db
        .update(mains)
        .set({ viewCount: item.viewCount + 1 })
        .where(eq(mains.id, item.id));
    }

    return item;
  }),

  // 创建主题
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        business: z.string().optional(),
        issue: z.string().optional(),
        reason: z.string().optional(),
        type: z.enum(["post", "suggestion"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [main] = await ctx.db
        .insert(mains)
        .values({
          userId: ctx.session.user.id,
          title: input.title,
          business: input.business,
          issue: input.issue,
          reason: input.reason,
          type: input.type,
        })
        .returning();

      if (!main) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create main topic",
        });
      }

      return main;
    }),

  // 删除主题
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const main = await ctx.db.query.mains.findFirst({
        where: (mains, { eq }) => eq(mains.id, input.id),
      });

      if (!main || main.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized",
        });
      }

      return ctx.db.delete(mains).where(eq(mains.id, input.id));
    }),
});
