import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Home4Props {
  main: any;
}

export default function Home4({ main }: Home4Props) {
  const router = useRouter();
  const session = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);

  const dataPost = main?.posts?.find((post: any) => post.type === "data");
  const reasonPost = main?.posts?.find((post: any) => post.type === "reason");
  const planPost = main?.posts?.find((post: any) => post.type === "plan");

  return (
    <div className="flex h-full min-w-full flex-col overflow-y-auto px-8 pb-24 pt-8">
      {/* Header section */}
      <div className="mb-2">
        <h1 className="font-semibold">案例讨论</h1>
      </div>

      {/* Content section */}
      <div className="flex-1 space-y-6">
        {/* Title section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{main?.title}</h2>
          <Separator />
        </div>

        {/* Conflict description */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">冲突描述</h2>

          <div className="space-y-2">
            <div
              className={`text-muted-foreground ${isExpanded ? "" : "line-clamp-1"}`}
            >
              <p className="whitespace-pre-line">
                {main?.business}
                {main?.issue}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center text-blue-500 hover:text-blue-600"
              >
                {isExpanded ? "收起" : "详情"}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-start gap-12 pt-8">
              {dataPost && (
                <Link
                  href={`/post/${dataPost?.id}`}
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                >
                  财报解读
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
              {session.data?.user.role === "admin" && (
                <button
                  className="flex items-center text-blue-500 hover:text-blue-600"
                  onClick={() =>
                    router.push(
                      `/post/new?mainId=${main?.id}&type=data` +
                        (!dataPost ? "" : `&postId=${dataPost?.id}`),
                    )
                  }
                >
                  管理{!dataPost ? "输入" : "修改"}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-start gap-12 pt-8">
              {reasonPost && (
                <Link
                  href={`/post/${reasonPost?.id}`}
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                >
                  根因分析
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
              {session.data?.user.role === "admin" && (
                <button
                  className="flex items-center text-blue-500 hover:text-blue-600"
                  onClick={() =>
                    router.push(
                      `/post/new?mainId=${main?.id}&type=reason` +
                        (!reasonPost ? "" : `&postId=${reasonPost?.id}`),
                    )
                  }
                >
                  管理{!reasonPost ? "输入" : "修改"}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Problems and challenges */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">问题与挑战</h2>
          <div className="space-y-2 pl-6 text-muted-foreground">
            <p className="whitespace-pre-line">{main?.reason}</p>
          </div>
        </div>

        {/* Current solution */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">当前方案</h2>
          <div className="space-y-2">
            <div
              className={`text-muted-foreground ${isExpanded2 ? "" : "line-clamp-2"}`}
            >
              <p className="whitespace-pre-line">{planPost?.summary}</p>
            </div>
            <div className="flex flex-col items-end justify-end">
              <div
                onClick={() => setIsExpanded2(!isExpanded2)}
                className="inline-flex items-center text-blue-500 hover:text-blue-600"
              >
                {isExpanded2 ? "收起" : "更多"}
                {isExpanded2 ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-start gap-12">
              {planPost && (
                <Link
                  href={`/post/${planPost?.id}`}
                  className="inline-flex items-center text-blue-500 hover:text-blue-600"
                >
                  方案讨论
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
              {session.data?.user.role === "admin" && (
                <button
                  className="flex items-center text-blue-500 hover:text-blue-600"
                  onClick={() =>
                    router.push(
                      `/post/new?mainId=${main?.id}&type=plan` +
                        (!planPost ? "" : `&postId=${planPost?.id}`),
                    )
                  }
                >
                  管理{!planPost ? "输入" : "修改"}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
