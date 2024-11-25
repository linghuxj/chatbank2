import { notFound } from "next/navigation";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Comments } from "./_components/comments";
import { api } from "@/trpc/server";
import { SubHeader } from "@/components/header/sub-header";

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
      <div className="container px-4 py-8">
        <article className="prose mx-auto max-w-xl md:max-w-4xl">
          <p>{post.summary}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{post.user.name}</span>
            <time dateTime={post.createdAt.toISOString()}>
              {format(new Date(post.createdAt), "PPP", { locale: zhCN })}
            </time>
          </div>
          <div className="mt-8">{post.content}</div>
        </article>

        <div className="mx-auto mt-16 max-w-4xl">
          <Comments postId={id} userId={post.userId} />
        </div>
      </div>
    </>
  );
}
