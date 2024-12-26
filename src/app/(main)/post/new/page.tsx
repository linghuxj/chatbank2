"use client";

import { api } from "@/trpc/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubHeader } from "@/components/header/sub-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "@/lib/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const createPostSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  content: z.string().min(1, "内容不能为空"),
  summary: z.string().optional(),
});

type FormData = z.infer<typeof createPostSchema>;

export default function NewPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mainId = searchParams.get("mainId");
  const type = searchParams.get("type");
  const postId = searchParams.get("postId");

  const post = api.post.getById.useQuery(
    { id: postId ?? "" },
    { enabled: !!postId },
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createPostSchema),
  });

  useEffect(() => {
    if (post.data) {
      setValue("title", post.data.title);
      setValue("content", post.data.content);
      setValue("summary", post.data.summary ?? "");
    }
  }, [post.data, setValue]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      toast({
        title: "创建成功",
        description: "内容已创建，可点击查看...",
      });
      void queryClient.invalidateQueries({
        queryKey: [["main", "getById"]],
      });
      router.back();
    },
  });

  const updatePost = api.post.update.useMutation({
    onSuccess: () => {
      toast({
        title: "修改成功",
        description: "内容已修改，可点击查看...",
      });
      void queryClient.invalidateQueries({
        queryKey: [["main", "getById"]],
      });
      router.back();
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (postId) {
        // 更新模式
        await updatePost.mutateAsync({
          id: postId,
          ...data,
        });
      } else {
        // 创建模式
        if (!mainId || !type) {
          throw new Error("参数错误");
        }
        await createPost.mutateAsync({
          ...data,
          mainId,
          type,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mainId || !type) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 text-center text-xl">
        参数错误
        <Button onClick={() => router.back()}>返回上一页</Button>
      </div>
    );
  }

  return (
    <>
      <SubHeader title={postId ? "编辑帖子" : "创建新帖子"} />
      <div className="mx-auto w-full max-w-xl p-6 md:max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input id="title" {...register("title")} placeholder="请输入标题" />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">
              摘要 (可选，即主管页或者客观页显示内容)
            </Label>
            <Textarea
              id="summary"
              {...register("summary")}
              rows={5}
              placeholder="请输入摘要"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">内容</Label>
            <Textarea
              id="content"
              {...register("content")}
              rows={10}
              placeholder="请输入内容"
            />
            {errors.content && (
              <p className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                提交中...
              </>
            ) : (
              "发布"
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
