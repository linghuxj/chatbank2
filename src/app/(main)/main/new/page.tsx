"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubHeader } from "@/components/header/sub-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "@/lib/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const createMainSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  type: z.enum(["post", "suggestion"], {
    required_error: "请选择类型",
  }),
  hasSubjective: z.boolean().default(false),
  hasObjective: z.boolean().default(false),
});

type FormData = z.infer<typeof createMainSchema>;

export default function MainNewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createMainSchema),
  });

  const createMain = api.main.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: "创建成功",
        description: "内容已创建，正在跳转...",
      });
      router.push(`/main?id=${data.id}`);
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const subjective = data.hasSubjective ? 0 : 1;
    const objective = data.hasObjective ? 0 : 2;
    const maxPage = subjective + objective;
    if (maxPage === 0) {
      toast({
        title: "请至少选择一个页面",
        variant: "destructive",
      });
      return;
    }
    try {
      await createMain.mutateAsync({
        ...data,
        maxPage,
      });
    } catch (error) {
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SubHeader title="创建新主题" />
      <div className="mx-auto w-full max-w-xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg">
              标题
            </Label>
            <Input id="title" {...register("title")} placeholder="请输入标题" />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-lg">
              类型
            </Label>
            <Select
              onValueChange={(value) =>
                setValue("type", value as "post" | "suggestion")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="post">案例讨论</SelectItem>
                <SelectItem value="suggestion">意见征集</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="hasSubjective"
                {...register("hasSubjective")}
                onCheckedChange={(checked) =>
                  setValue("hasSubjective", checked)
                }
              />
              <Label htmlFor="hasSubjective">是否显示主观页</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="hasObjective"
                {...register("hasObjective")}
                onCheckedChange={(checked) => setValue("hasObjective", checked)}
              />
              <Label htmlFor="hasObjective">是否显示客观页</Label>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                提交中...
              </>
            ) : (
              "创建"
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
