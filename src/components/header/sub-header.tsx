"use client";

import { ArrowLeft, User, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";

interface SubHeaderProps {
  title: string;
}

export function SubHeader({ title }: SubHeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between p-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">{title}</h1>
        {session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center gap-2">
                <span className="hidden sm:inline">{session.user.name}</span>
                <Avatar>
                  <AvatarImage src={session?.user?.image ?? ""} />
                  <AvatarFallback>
                    {session?.user?.name?.[0] ?? "CB"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                个人中心
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                设置
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
