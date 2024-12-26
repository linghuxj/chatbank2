"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import React from "react";
import { mainNavItems, mainRoutes } from "@/lib/common/constants";

export function MobileNav() {
  const pathname = usePathname();

  // 如果当前路径不是一级路由，不显示MobileNav
  if (!mainRoutes.includes(pathname)) {
    return null;
  }

  return (
    <nav
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2",
        "flex items-center gap-4",
        "bg-background/40 backdrop-blur-xl",
        "border border-border/50",
        "shadow-lg",
        "rounded-full",
        "px-6 py-2",
        "mx-auto w-fit",
        "z-50",
      )}
    >
      {mainNavItems.map((item) => {
        const isActive = pathname === item.href;
        const IconComponent = item.icon;

        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "ghost"}
            size="icon"
            className={cn(
              "rounded-full",
              "transition-all duration-300 ease-in-out",
              "h-10 w-10",
            )}
            asChild
          >
            <Link href={item.href}>
              <IconComponent className="h-5 w-5 transition-colors duration-300" />
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
