"use client";

import { SubHeader } from "@/components/header/sub-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/lib/hooks/use-toast";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(255, "标题最多255个字符"),
  content: z.string().min(1, "内容不能为空"),
  summary: z.string().max(500, "摘要最多500个字符").optional(),
});

type PostInput = z.infer<typeof postSchema>;

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
  });

  const createPostMutation = api.post.create.useMutation();

  const handleCreatePost = async (data: PostInput) => {
    try {
      const post = await createPostMutation.mutateAsync(data);

      toast({
        title: "发布成功",
        description: "正在跳转到文章页面...",
      });

      router.push(`/post/${post.id}`);
      router.refresh();
    } catch (error) {
      console.error("Create post error:", error);
      toast({
        title: "发布失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <SubHeader title="发布" />
      <div className="px-4 py-8">
        <form className="grid gap-4" onSubmit={handleSubmit(handleCreatePost)}>
          <div className="grid gap-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="summary">摘要（可选）</Label>
            <Input
              id="summary"
              {...register("summary")}
              className={errors.summary ? "border-red-500" : ""}
            />
            {errors.summary && (
              <p className="text-sm text-red-500">{errors.summary.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">内容</Label>
            <Textarea
              id="content"
              rows={10}
              {...register("content")}
              className={errors.content ? "border-red-500" : ""}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "发布中..." : "发布"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.back()}
            >
              取消
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
