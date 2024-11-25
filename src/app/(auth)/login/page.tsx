"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/lib/hooks/use-toast";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = api.login.verifyCredentials.useMutation();

  const handleCredentialsLogin = async (data: LoginInput) => {
    try {
      const result = await loginMutation.mutateAsync({
        phone: data.phone,
        password: data.password,
      });

      if (result.success && result.user) {
        toast({
          title: "登录成功",
          description: "正在跳转...",
        });

        // 登录成功后 创建会话
        await signIn("credentials", {
          phone: data.phone,
          password: data.password,
          redirect: false,
        });

        router.push("/");
        router.refresh();
      } else {
        toast({
          title: "登录失败",
          description: "请检查您的手机号和密码",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "登录失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  const handleWechatLogin = async () => {
    toast({
      title: "微信登录",
      description: "正在完善中...请稍后",
    });
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">登录</CardTitle>
        <CardDescription>输入您的手机号和密码登录您的账号</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={handleSubmit(handleCredentialsLogin)}
        >
          <div className="grid gap-2">
            <Label htmlFor="phone">手机号</Label>
            <Input
              id="phone"
              type="text"
              maxLength={11}
              placeholder="输入您的手机号"
              required
              {...register("phone")}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">密码</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                忘记密码?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "登录中..." : "登录"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleWechatLogin}
          >
            微信登录
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          没有账号?{" "}
          <Link href="/register" className="underline">
            注册
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
