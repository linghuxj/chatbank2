"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { api } from "@/trpc/react";
import { PostCard } from "../_components/post-card";
import { Loader2, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PostPage() {
  const session = useSession();
  const router = useRouter();
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
  } = api.main.getList.useInfiniteQuery(
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

  const mains = data?.pages.flatMap((page) => page.items) ?? [];

  if (status === "pending") {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">加载中...</span>
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 text-center">加载失败</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {session.data?.user.role === "admin" && (
        <div className="mb-4 flex flex-col items-center justify-center space-y-2">
          <Button
            className="flex items-center gap-2 self-end"
            onClick={() => router.push("/main/new")}
          >
            新增
            <Plus className="h-4 w-4" />
          </Button>
          <Separator />
        </div>
      )}

      <div className="space-y-4">
        {mains.map((main, i) => (
          <div key={i} className="space-y-4">
            <PostCard key={main.id} post={main} />
          </div>
        ))}
      </div>

      {/* 加载更多触发器 */}
      <div ref={ref} className="mt-4 flex justify-center p-4">
        {isFetchingNextPage ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">加载中...</span>
          </>
        ) : hasNextPage ? (
          <span className="text-sm text-gray-500">向下滑动加载更多</span>
        ) : (
          <span className="text-sm text-gray-500">没有更多内容了</span>
        )}
      </div>
    </div>
  );
}
