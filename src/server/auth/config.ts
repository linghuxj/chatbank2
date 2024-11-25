import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  type DefaultSession,
  type NextAuthConfig,
  getServerSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { db } from "@/server/db";
import { env } from "@/env";
import { type Adapter } from "next-auth/adapters";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      phone: string;
      role: string;
    } & DefaultSession["user"];
  }

  // 添加 User 接口定义
  interface User {
    id: string;
    phone: string | null;
    role: string;
    name?: string | null;
    image?: string | null;
  }
}

// 如果使用 JWT，还需要扩展 JWT 类型
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone: string | null;
    role: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    // 手机号密码登录
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.phone || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.phone, credentials.phone),
          });

          if (!user?.phone) {
            console.log("User not found");
            return null;
          }

          const account = await db.query.accounts.findFirst({
            where: (accounts, { eq, and }) =>
              and(
                eq(accounts.userId, user.id),
                eq(accounts.provider, "credentials"),
              ),
          });

          if (!account) {
            console.log("Account not found");
            return null;
          }

          const isValid = await compare(
            credentials.password,
            account.access_token!,
          );

          if (!isValid) {
            console.log("Invalid password");
            return null;
          }

          console.log("Login successful", user);
          return {
            id: user.id,
            phone: user.phone,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.role = user.role;
      }
      // 保存微信 access_token
      if (account?.provider === "wechat") {
        token.accessToken = account.access_token;
      }
      return token;
    },

    session: async ({ session, token }) => {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          phone: token.phone ?? "",
          role: token.role ?? "",
        };
      }
      return session;
    },

    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith(baseUrl) || url.startsWith("/")) {
        return url;
      }
      return baseUrl;
    },
  },

  events: {
    async signIn({ user, account }) {
      console.log(`User ${user.id} signed in via ${account?.provider}`);
    },
  },

  secret: env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

export const getServerAuthSession = () => getServerSession(authConfig);
