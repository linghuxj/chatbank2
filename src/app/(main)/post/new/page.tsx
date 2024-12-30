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
import { Switch } from "@/components/ui/switch";

const createPostSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  summary: z.string().optional(),
  summaryLabel: z.string().optional(),
  hasSubPage: z.boolean().default(false),
});

type FormData = z.infer<typeof createPostSchema>;

export default function NewPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mainId = searchParams.get("mainId");
  const type = searchParams.get("type");
  const postId = searchParams.get("postId");
  const current = searchParams.get("current") ?? 0;
  const [toNext, setToNext] = useState(false);

  const post = api.post.getById.useQuery(
    { id: postId ?? "" },
    { enabled: !!postId },
  );
  const { data: nextPosts } = api.post.getNextPosts.useQuery(
    { mainId: mainId ?? "" },
    {
      enabled: !!mainId && !!type && (type === "step" || type === "step-next"),
    },
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      hasSubPage: false,
    },
  });

  useEffect(() => {
    if (post.data) {
      setValue("title", post.data.title);
      setValue("content", post.data.content);
      setValue("summary", post.data.summary ?? "");
      setValue("summaryLabel", post.data.summaryLabel ?? "");
      setValue("hasSubPage", post.data.hasSubPage);
    }
  }, [post.data, setValue]);

  useEffect(() => {
    if (type === "step-next" || type === "step") {
      setToNext(true);
      if (type === "step" && !postId) {
        // 新增第一个的时候不能去下一步
        setToNext(false);
      }
    }
  }, [type, postId]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      toast({
        title: "创建成功",
        description:
          type === "step" || type === "step-next"
            ? "内容已创建，可继续创建下一步确认内容"
            : "内容已创建，返回可点击查看...",
      });
      void queryClient.invalidateQueries({
        queryKey: [["main", "getById"]],
      });
      if (type !== "step" && type !== "step-next") {
        router.back();
      } else {
        setToNext(true);
      }
    },
  });

  const updatePost = api.post.update.useMutation({
    onSuccess: () => {
      toast({
        title: "修改成功",
        description:
          type === "step" || type === "step-next"
            ? "内容已修改，可继续创建下一步确认内容"
            : "内容已修改，返回可点击查看...",
      });
      void queryClient.invalidateQueries({
        queryKey: [["main", "getById"]],
      });
      if (type !== "step" && type !== "step-next") {
        router.back();
      }
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
          toast({
            title: "参数错误",
            variant: "destructive",
          });
          return;
        }
        await createPost.mutateAsync({
          ...data,
          mainId,
          type,
        });
      }
    } catch (error) {
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    let nextPostId;
    let currentNum = Number(current);
    if (nextPosts && nextPosts.length > currentNum) {
      nextPostId = nextPosts[currentNum]?.id;
    }
    currentNum++;
    reset();
    router.replace(
      `/post/new?mainId=${mainId}&type=step-next&current=${currentNum}` +
        (nextPostId ? `&postId=${nextPostId}` : ""),
    );
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
            <Label htmlFor="summaryLabel" className="text-lg">
              一级页面标题 (可选，即主管页或者客观页显示标题)
            </Label>
            <Input
              id="summaryLabel"
              {...register("summaryLabel")}
              placeholder="请输入摘要标题"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary" className="text-lg">
              一级页面内容 (可选，即主管页或者客观页显示内容)
            </Label>
            <Textarea
              id="summary"
              {...register("summary")}
              rows={5}
              placeholder="请输入摘要"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="hasSubPage"
              checked={watch("hasSubPage")}
              onCheckedChange={(checked) => setValue("hasSubPage", checked)}
            />
            <Label htmlFor="hasSubPage">
              是否显示确认页（即可查看的二级页面）
            </Label>
          </div>

          {watch("hasSubPage") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg">
                  确认页标题（可选，即二级页面标题）
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="请输入标题"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-lg">
                  确认页内容（可选，即二级页面内容）
                </Label>
                <Textarea
                  id="content"
                  {...register("content")}
                  rows={5}
                  placeholder="请输入内容"
                />
              </div>
            </>
          )}

          <div className="flex gap-12">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  提交中...
                </>
              ) : !!postId ? (
                "修改"
              ) : (
                "发布"
              )}
            </Button>
            {(type === "step" || type === "step-next") && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => handleNext()}
                disabled={!toNext || isSubmitting}
              >
                {nextPosts && nextPosts.length > Number(current)
                  ? "修改下一个确认方案"
                  : "新增确认方案"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
