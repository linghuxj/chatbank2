"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { VenetianMask } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useReplyContext } from "./reply-context";

export const Comments = ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  const { data: session } = useSession();
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "300px 0px",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.comment.getList.useInfiniteQuery(
      {
        postId,
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
      },
    );

  const [replyTo, setReplyTo] = useState<{
    commentId: string;
    userName: string;
  } | null>(null);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const comments = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">
        留言
        {replyTo && (
          <span className="ml-2 text-base font-normal text-muted-foreground">
            回复 {replyTo.userName}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={() => setReplyTo(null)}
            >
              取消回复
            </Button>
          </span>
        )}
      </h2>

      {!session ? (
        <p className="text-muted-foreground">请登录后查看留言</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              userId={userId}
            />
          ))}

          {/* 加载更多指示器 */}
          <div ref={ref} className="py-4 text-center">
            {isFetchingNextPage ? (
              <span className="text-muted-foreground">加载更多留言...</span>
            ) : hasNextPage ? (
              <span className="text-muted-foreground">向下滚动加载更多</span>
            ) : comments.length > 0 ? (
              <span className="text-muted-foreground">已经到底啦</span>
            ) : (
              <span className="text-muted-foreground">暂无留言</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// 留言项组件
const CommentItem = ({
  comment,
  postId,
  userId,
}: {
  comment: any;
  postId: string;
  userId: string;
}) => {
  const { data: session } = useSession();
  const utils = api.useUtils();
  const [showReplies, setShowReplies] = useState(false);
  const [page, setPage] = useState(1);
  const { setReplyTo } = useReplyContext();

  const {
    data: repliesData,
    isLoading: isRepliesLoading,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = api.reply.getList.useInfiniteQuery(
    {
      commentId: comment.id,
      limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: showReplies, // 只在显示回复时才请求数据
    },
  );

  const replies = repliesData?.pages.flatMap((page) => page.items) ?? [];
  const totalReplies = comment.replyCount || 0; // 需要后端提供总回复数

  const { mutate: deleteComment } = api.comment.delete.useMutation({
    onSuccess: () => {
      void utils.comment.getList.invalidate({ postId });
    },
  });

  const handleDelete = () => {
    if (!session || session.user.id !== comment.userId) return;
    if (window.confirm("确定要删除这条留言吗？")) {
      deleteComment({ id: comment.id });
    }
  };

  return (
    <div className="space-y-2 rounded-lg bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={comment.user.image ?? ""} />
              <AvatarFallback>{comment.user.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{comment.user.name}</span>
          </div>
          {session?.user.id === comment.userId && (
            <VenetianMask className="h-4 w-4 text-blue-800" />
          )}
          {userId === comment.userId && <Badge variant="secondary">作者</Badge>}
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
              locale: zhCN,
            })}
          </span>
        </div>
        {session?.user.id === comment.userId && (
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            删除
          </Button>
        )}
      </div>

      <p>{comment.content}</p>

      {session && (
        <div className="space-y-2">
          <div className="flex items-center gap-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setReplyTo({
                  commentId: comment.id,
                  userName: comment.user.name,
                })
              }
            >
              回复
            </Button>

            {/* 回复列表切换按钮 */}
            {totalReplies > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-2"
              >
                {showReplies ? "收起回复" : `查看回复 (${totalReplies})`}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 回复列表 */}
      {showReplies && (
        <div className="ml-8 mt-4 space-y-4">
          {isRepliesLoading ? (
            <div className="text-center text-muted-foreground">加载中...</div>
          ) : replies.length > 0 ? (
            <>
              <div className="space-y-4">
                {replies.map((reply: any) => (
                  <ReplyItem
                    key={reply.id}
                    reply={reply}
                    postId={postId}
                    userId={userId}
                  />
                ))}
              </div>

              {/* 分页控制 */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void fetchPreviousPage();
                    setPage((p) => p - 1);
                  }}
                  disabled={!hasPreviousPage}
                >
                  上一页
                </Button>
                <span className="text-sm text-muted-foreground">
                  第 {page} 页
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void fetchNextPage();
                    setPage((p) => p + 1);
                  }}
                  disabled={!hasNextPage}
                >
                  下一页
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">暂无回复</div>
          )}
        </div>
      )}
    </div>
  );
};

// 回复项组件
const ReplyItem = ({
  reply,
  postId,
  userId,
}: {
  reply: any;
  postId: string;
  userId: string;
}) => {
  const { data: session } = useSession();
  const utils = api.useUtils();

  const { mutate: deleteReply } = api.reply.delete.useMutation({
    onSuccess: () => {
      void utils.comment.getList.invalidate({ postId });
    },
  });

  const handleDelete = () => {
    if (!session || session.user.id !== reply.userId) return;
    if (window.confirm("确定要删除这条回复吗？")) {
      deleteReply({ id: reply.id });
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={reply.user.image ?? ""} />
              <AvatarFallback>{reply.user.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{reply.user.name}</span>
          </div>
          {session?.user.id === reply.userId && (
            <VenetianMask className="h-4 w-4 text-blue-800" />
          )}
          {userId === reply.userId && <Badge variant="secondary">作者</Badge>}
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(reply.createdAt), {
              addSuffix: true,
              locale: zhCN,
            })}
          </span>
        </div>
        {session?.user.id === reply.userId && (
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            删除
          </Button>
        )}
      </div>
      <p>{reply.content}</p>
    </div>
  );
};
