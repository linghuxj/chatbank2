"use client";

import { api } from "@/trpc/react";
import { useRouter, useSearchParams } from "next/navigation";
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

const SUBJECTIVE = 0b01; // 1
const OBJECTIVE = 0b10; // 2

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
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: existingMain } = api.main.getById.useQuery(
    { id: id ?? "" },
    { enabled: !!id },
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createMainSchema),
    values: existingMain
      ? {
          title: existingMain.title,
          type: existingMain.type as "post" | "suggestion",
          hasSubjective: Boolean(existingMain.maxPage & SUBJECTIVE),
          hasObjective: Boolean(existingMain.maxPage & OBJECTIVE),
        }
      : undefined,
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

  const updateMain = api.main.update.useMutation({
    onSuccess: () => {
      toast({
        title: "更新成功",
        description: "内容已更新，正在跳转...",
      });
      router.push(`/main?id=${id}`);
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const maxPage =
      (data.hasSubjective ? SUBJECTIVE : 0) |
      (data.hasObjective ? OBJECTIVE : 0);

    if (maxPage === 0) {
      toast({
        title: "请至少选择一个页面",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      if (id) {
        await updateMain.mutateAsync({
          id,
          title: data.title,
          maxPage,
        });
      } else {
        await createMain.mutateAsync({
          ...data,
          maxPage,
        });
      }
    } catch (error) {
      toast({
        title: id ? "更新失败" : "创建失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SubHeader title={id ? "编辑主题" : "创建新主题"} />
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
              value={existingMain?.type ?? undefined}
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
                checked={
                  existingMain
                    ? Boolean(existingMain.maxPage & SUBJECTIVE)
                    : false
                }
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
                checked={
                  existingMain
                    ? Boolean(existingMain.maxPage & OBJECTIVE)
                    : false
                }
                onCheckedChange={(checked) => setValue("hasObjective", checked)}
              />
              <Label htmlFor="hasObjective">是否显示客观页</Label>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {id ? "更新中..." : "提交中..."}
              </>
            ) : id ? (
              "更新"
            ) : (
              "创建"
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
