import { notFound } from "next/navigation";
import { Comments } from "./_components/comments";
import { api } from "@/trpc/server";
import { SubHeader } from "@/components/header/sub-header";
import { Markdown } from "@lobehub/ui";
import { CommentInput } from "./_components/comment-input";
import { Suspense } from "react";
import { ReplyContextProvider } from "./_components/reply-context";

export default async function PostDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const post = await api.post.getById({ id });

  if (!post) {
    notFound();
  }

  return (
    <>
      <SubHeader title={post.title} />
      <div className="container p-4">
        <article className="prose mx-auto max-w-xl md:max-w-4xl">
          <Markdown variant="normal" allowHtml>
            {post.content}
          </Markdown>
        </article>

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

          <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
            <div className="container mx-auto max-w-4xl p-4">
              <CommentInput
                postId={id}
                commentHints={post.remarks?.split(",") ?? []}
              />
            </div>
          </div>
        </ReplyContextProvider>
      </div>
    </>
  );
}
