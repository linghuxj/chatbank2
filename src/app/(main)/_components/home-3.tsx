"use client";

import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Home3Props {
  onNext: () => void;
  main: any;
}

export default function Home3({ onNext, main }: Home3Props) {
  const router = useRouter();
  const session = useSession();

  const newPost = main?.posts?.find((post: any) => post.type === "new");
  const incomePost = main?.posts?.find((post: any) => post.type === "income");
  const competitivePost = main?.posts?.find(
    (post: any) => post.type === "competitive",
  );
  const stepPost = main?.posts?.find((post: any) => post.type === "step");

  return (
    <div className="flex h-full min-w-full flex-col overflow-y-auto">
      {/* Content section */}
      <div className="flex-1 space-y-6">
        <div className="px-8 pb-4 pt-8">
          <h2 className="text-2xl font-bold">现有财税诊断业务的发展建议</h2>
          <span className="mb-8 text-muted-foreground">@财智领航公司</span>

          <Separator className="my-4" />

          <div className="space-y-12">
            <div className="flex flex-col space-y-2">
              <p className="text-center text-muted-foreground">
                突破现有业务瓶颈的
              </p>
              {newPost && (
                <>
                  <div className="text-center text-lg">
                    {newPost.summaryLabel}
                  </div>
                  <p className="whitespace-pre-line text-center text-muted-foreground">
                    {newPost.summary}
                  </p>
                </>
              )}
              <div className="flex justify-center gap-8 self-end">
                {session.data?.user.role === "admin" && (
                  <button
                    className="flex items-center text-blue-500 hover:text-blue-600"
                    onClick={() =>
                      router.push(
                        `/post/new?mainId=${main?.id}&type=new` +
                          (!newPost ? "" : `&postId=${newPost?.id}`),
                      )
                    }
                  >
                    管理{!newPost ? "输入" : "修改"}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                )}
                {newPost && (
                  <button
                    className="flex items-center self-end text-blue-500 hover:text-blue-600"
                    onClick={() => router.push(`/post/${newPost?.id}`)}
                  >
                    查看
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              {incomePost && (
                <>
                  <div className="text-center text-lg">
                    {incomePost.summaryLabel}
                  </div>
                  <p className="whitespace-pre-line text-center text-muted-foreground">
                    {incomePost.summary}
                  </p>
                </>
              )}
              <div className="flex justify-center gap-8 self-end">
                {session.data?.user.role === "admin" && (
                  <button
                    className="mt-2 flex items-center self-end text-blue-500 hover:text-blue-600"
                    onClick={() =>
                      router.push(
                        `/post/new?mainId=${main?.id}&type=income` +
                          (!incomePost ? "" : `&postId=${incomePost?.id}`),
                      )
                    }
                  >
                    管理{!incomePost ? "输入" : "修改"}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                )}
                {incomePost && (
                  <button
                    className="mt-2 flex items-center self-end text-blue-500 hover:text-blue-600"
                    onClick={() => router.push(`/post/${incomePost?.id}`)}
                  >
                    查看
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              {competitivePost && (
                <>
                  <div className="text-center text-lg">
                    {competitivePost.summaryLabel}
                  </div>
                  <p className="whitespace-pre-line text-center text-muted-foreground">
                    {competitivePost.summary}
                  </p>
                </>
              )}
              <div className="flex justify-center gap-8 self-end">
                {session.data?.user.role === "admin" && (
                  <button
                    className="mt-2 flex items-center self-end text-blue-500 hover:text-blue-600"
                    onClick={() =>
                      router.push(
                        `/post/new?mainId=${main?.id}&type=competitive` +
                          (!competitivePost
                            ? ""
                            : `&postId=${competitivePost?.id}`),
                      )
                    }
                  >
                    管理{!competitivePost ? "输入" : "修改"}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                )}
                {competitivePost && (
                  <button
                    className="mt-2 flex items-center self-end text-blue-500 hover:text-blue-600"
                    onClick={() => router.push(`/post/${competitivePost?.id}`)}
                  >
                    查看
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-12 pt-12">
              {session.data?.user.role === "admin" && (
                <button
                  className="flex items-center text-blue-500 hover:text-blue-600"
                  onClick={() =>
                    router.push(
                      `/post/new?mainId=${main?.id}&type=step` +
                        (!stepPost ? "" : `&postId=${stepPost?.id}`),
                    )
                  }
                >
                  管理{!stepPost ? "输入" : "修改"}(简单几步)
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              )}
              {stepPost && (
                <div
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                  onClick={() =>
                    router.push(
                      `/post/${stepPost?.id}?isStep=true&mainId=${main?.id}`,
                    )
                  }
                >
                  只需简单几步
                  <ChevronRight className="h-4 w-4" />
                </div>
              )}
            </div>

            <div
              className="flex items-center justify-center gap-1 text-muted-foreground"
              onClick={() => onNext()}
            >
              收获更多主意
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
