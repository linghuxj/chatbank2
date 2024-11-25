"use client";

import { api } from "@/trpc/react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "300px 0px",
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isError,
  } = api.post.getList.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: undefined,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  if (status === "pending") {
    return <div className="py-4 text-center">加载中...</div>;
  }

  if (isError) {
    return (
      <div className="py-4 text-center text-red-500">加载失败，请刷新重试</div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground">暂无内容</div>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-6 px-4 py-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <Link href={`/post/${post.id}`} className="block">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              {post.summary && (
                <p className="mt-2 text-muted-foreground">{post.summary}</p>
              )}
              <div className="mt-4 flex items-center justify-between gap-4 text-sm text-muted-foreground">
                <span>{post.user.name}</span>
                <div className="flex items-center gap-4">
                  <span>
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                      locale: zhCN,
                    })}
                  </span>
                  <Badge variant="outline">{post.commentCount} 评论</Badge>
                </div>
              </div>
            </Link>
          </article>
        ))}

        <div ref={ref} className="py-4 text-center">
          {isFetchingNextPage ? (
            <span className="text-muted-foreground">加载更多...</span>
          ) : hasNextPage ? (
            <span className="text-muted-foreground">向下滚动加载更多</span>
          ) : posts.length > 0 ? (
            <span className="text-muted-foreground">已经到底啦</span>
          ) : null}
        </div>
      </div>

      {isAdmin && (
        <Link
          href="/post/new"
          className="fixed bottom-16 right-8 rounded-full shadow-lg"
        >
          <Button size="icon" className="h-14 w-14 rounded-full">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      )}
    </div>
  );
}
