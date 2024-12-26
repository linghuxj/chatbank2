"use client";

import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Comments } from "./_components/comments";
import { api } from "@/trpc/react";
import { SubHeader } from "@/components/header/sub-header";
import { Markdown } from "@lobehub/ui";
import { CommentInput } from "./_components/comment-input";
import { Suspense, useState } from "react";
import { ReplyContextProvider } from "./_components/reply-context";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "@/lib/hooks/use-toast";
import { ChevronDown } from "lucide-react";

export default function PostDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isInputOpen, setIsInputOpen] = useState(false);
  const { data: session } = useSession();
  const utils = api.useUtils();
  const searchParams = useSearchParams();
  const isStep = searchParams.get("isStep") === "true";
  const mainId = searchParams.get("mainId");
  const current = searchParams.get("current") ?? -1;

  const { data: post, isLoading } = api.post.getById.useQuery({ id });
  const confirmMutation = api.post.confirm.useMutation();
  const { data: nextPosts } = api.post.getNextPosts.useQuery(
    {
      mainId: mainId ?? "",
    },
    { enabled: !!mainId },
  );

  const handleNextPage = () => {
    if (isStep && nextPosts && nextPosts.length > 0) {
      const currentIndex = Number(current);
      if (currentIndex < nextPosts.length - 1) {
        const nextPost = nextPosts[currentIndex + 1];
        if (nextPost) {
          router.push(
            `/post/${nextPost.id}?isStep=true&mainId=${mainId}&current=${currentIndex + 1}`,
          );
        }
      }
    }
  };

  const handleConfirm = async () => {
    await confirmMutation.mutateAsync({ id });
    await utils.post.getById.invalidate({ id });
    toast({
      title: "确认成功",
      description: "帖子已确认",
    });
  };

  if (isLoading) {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center">
        <div className="animate-pulse">加载中...</div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <>
      <SubHeader title={isStep ? "请逐条修改或确认" : post.title} />
      <div className="container p-4">
        {isStep && <div className="mb-2 text-center text-lg">{post.title}</div>}
        <article className="prose mx-auto max-w-xl md:max-w-4xl">
          <Markdown variant="normal" allowHtml>
            {post.content}
          </Markdown>
        </article>

        {session?.user?.id === post.userId && (
          <div className="mx-auto mt-2 flex max-w-xl gap-8 md:max-w-4xl">
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={post.isConfirmed}
            >
              {post.isConfirmed ? "已确认" : "确认"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsInputOpen(true)}
            >
              疑问、意见或补充
            </Button>
          </div>
        )}

        {isStep &&
          nextPosts &&
          nextPosts.length > 0 &&
          Number(current) < nextPosts.length - 1 && (
            <div
              className="mt-4 flex items-center justify-center gap-1 pt-4 text-blue-500 hover:text-blue-600"
              onClick={handleNextPage}
            >
              下一个确认项 <ChevronDown className="h-4 w-4" />
            </div>
          )}

        <ReplyContextProvider>
          <Suspense
            fallback={
              <div className="mx-auto mt-8 max-w-4xl">
                <div className="text-center text-muted-foreground">
                  加载评论中...
                </div>
              </div>
            }
          >
            <div className="mx-auto mt-8 max-w-4xl">
              <Comments postId={id} userId={post.userId} />
            </div>
          </Suspense>

          {isInputOpen && (
            <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
              <div className="container mx-auto max-w-4xl p-4">
                <CommentInput
                  postId={id}
                  commentHints={post.remarks?.split(",") ?? []}
                />
              </div>
            </div>
          )}
        </ReplyContextProvider>
      </div>
    </>
  );
}
