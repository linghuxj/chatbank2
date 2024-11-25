"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RegisterInput } from "@/lib/validations/auth";
import { api } from "@/trpc/react";
import { signIn } from "next-auth/react";
import { useToast } from "@/lib/hooks/use-toast";

const RegisterPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const login = api.login.verifyCredentials.useMutation();

  const registerMutation = api.login.register.useMutation({
    onSuccess: async (data) => {
      // 注册成功后自动登录
      const result = await login.mutateAsync({
        phone: data.user.phone,
        password: watch("password"),
        remember: true,
      });

      if (result.user) {
        const signInResult = await signIn("credentials", {
          phone: data.user.phone,
          password: watch("password"),
          redirect: false,
        });

        if (signInResult?.error) {
          toast({
            title: "注册失败",
            description: signInResult.error,
            variant: "destructive",
          });
          return;
        }

        // 手动执行重定向
        router.push("/");
      }
    },
    onError: (error) => {
      toast({
        title: "注册失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerMutation.mutateAsync({
        phone: data.phone,
        password: data.password,
        name: data.name,
      });
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your email below to register to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              required
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="text"
              placeholder="Enter your phone"
              required
              {...register("phone")}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
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
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={
              isSubmitting || registerMutation.isPending || login.isPending
            }
          >
            {isSubmitting || registerMutation.isPending || login.isPending
              ? "Registering..."
              : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterPage;
