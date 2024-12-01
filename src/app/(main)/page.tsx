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
import { SubHeader } from "@/components/header/sub-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  const utils = api.useUtils();
  const updatePostStatus = api.post.updateStatus.useMutation({
    onSuccess: () => {
      void utils.post.getList.invalidate();
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  if (status === "pending") {
    return (
      <>
        <SubHeader title="列表" />
        <div className="py-8 text-center">加载中...</div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <SubHeader title="列表" />
        <div className="py-8 text-center text-red-500">
          加载失败，请刷新重试
        </div>
      </>
    );
  }

  return (
    <>
      <SubHeader title="列表" />
      <div className="relative">
        <div className="space-y-6 px-4 py-8">
          {!posts.length ? (
            <div className="text-center text-muted-foreground">暂无内容</div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center justify-between">
                  <Link href={`/post/${post.id}`} className="block flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">{post.title}</h2>
                      {isAdmin && post.status === "draft" && (
                        <Badge variant="outline">已下架</Badge>
                      )}
                    </div>
                  </Link>
                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">打开菜单</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            updatePostStatus.mutate({
                              id: post.id,
                              status:
                                post.status === "published"
                                  ? "draft"
                                  : "published",
                            });
                          }}
                        >
                          {post.status === "published" ? "下架" : "上架"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                {post.summary && (
                  <p className="mt-2 text-muted-foreground">{post.summary}</p>
                )}
                <div className="mt-4 flex items-center justify-between gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={post.user.image ?? ""} />
                      <AvatarFallback>
                        {post.user.name?.[0] ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{post.user.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                        locale: zhCN,
                      })}
                    </span>
                    <Badge variant="outline">{post.commentCount} 留言</Badge>
                  </div>
                </div>
              </article>
            ))
          )}

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
    </>
  );
}
