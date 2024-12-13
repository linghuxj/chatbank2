"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useReplyContext } from "./reply-context";
import { X } from "lucide-react";
import { useRef } from "react";

export const CommentInput = ({
  postId,
  commentHints,
}: {
  postId: string;
  commentHints: string[];
}) => {
  const { data: session } = useSession();
  const utils = api.useUtils();
  const [content, setContent] = useState("");
  const { replyTo, setReplyTo } = useReplyContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const VERTICAL_SCROLL_INTERVAL = 3000; // 垂直滚动间隔（毫秒）
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHintIndex((prev) => (prev + 1) % commentHints.length);
    }, VERTICAL_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [commentHints.length]);

  const { mutate: createComment, isPending: isCommentPending } =
    api.comment.create.useMutation({
      onSuccess: () => {
        setContent("");
        void utils.comment.getList.invalidate({ postId });
      },
    });

  const { mutate: createReply, isPending: isReplyPending } =
    api.reply.create.useMutation({
      onSuccess: () => {
        setContent("");
        void utils.comment.getList.invalidate({ postId });
      },
    });

  const isPending = isCommentPending || isReplyPending;

  const handleSubmit = () => {
    if (!session || !content.trim()) return;

    if (replyTo) {
      createReply({
        commentId: replyTo.commentId,
        content: content.trim(),
      });
      setReplyTo(null);
    } else {
      createComment({
        postId,
        content: content.trim(),
        attitude: false,
      });
    }
  };

  if (!session) {
    return (
      <p className="text-center text-muted-foreground">请登录后发表留言</p>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col gap-2">
          <div className="min-h-6 w-full">
            {commentHints.map((hint, index) => (
              <div
                key={index}
                className={`text-sm text-muted-foreground transition-all duration-500 ${
                  index === currentHintIndex ? "block" : "hidden"
                }`}
              >
                {hint}
              </div>
            ))}
          </div>
          {replyTo && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {replyTo && (
                <span>
                  回复{" "}
                  <span className="font-bold text-blue-500">
                    @{replyTo.userName}
                  </span>
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  setReplyTo(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="relative flex items-center gap-2">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={replyTo ? "写下你的回复..." : "写下你的留言..."}
              disabled={isPending}
              className="max-h-[120px] min-h-[36px]"
            />
            <Button
              onClick={handleSubmit}
              disabled={isPending || !content.trim()}
            >
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
