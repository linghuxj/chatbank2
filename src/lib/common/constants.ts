import { Home, MessageCircle, User } from "lucide-react";

// 一级导航
export const mainNavItems = [
  // 首页
  { id: "home", label: "首页", href: "/", icon: Home },
  // 主页
  {
    id: "main",
    label: "主页",
    href: "/main",
    icon: MessageCircle,
  },
  // 帖子
  { id: "post", label: "帖子", href: "/post", icon: User },
];

// 一级路由
export const mainRoutes = mainNavItems.map((item) => item.href);

// 帖子类型
export const postTypes = [
  "new",
  "income",
  "competitive",
  "step",
  "data",
  "reason",
  "plan",
];
