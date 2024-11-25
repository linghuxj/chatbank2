import NextAuth from "next-auth";
import { authConfig } from "@/server/auth/config";

// 使用合并后的配置
const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
