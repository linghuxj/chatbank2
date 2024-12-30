import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Home4Props {
  main: any;
}

export default function Home4({ main }: Home4Props) {
  const router = useRouter();
  const session = useSession();

  const itemPost = (type: string) => {
    const post = main?.posts?.find((post: any) => post.type === type);
    return (
      <div className="flex flex-col space-y-2">
        {post && (
          <>
            <div className="text-lg">{post.summaryLabel}</div>
            <p className="whitespace-pre-line text-muted-foreground">
              {post.summary}
            </p>
          </>
        )}
        <div className="flex justify-center gap-8 self-end">
          {session.data?.user.role === "admin" && (
            <button
              className="mt-2 flex items-center self-end text-blue-500 hover:text-blue-600"
              onClick={() =>
                router.push(
                  `/post/new?mainId=${main?.id}&type=${type}` +
                    (!post ? "" : `&postId=${post?.id}`),
                )
              }
            >
              管理{!post ? "输入" : "修改"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          )}
          {post?.hasSubPage && (
            <button
              className="mt-2 flex items-center self-end text-blue-500 hover:text-blue-600"
              onClick={() => router.push(`/post/${post?.id}`)}
            >
              查看
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full min-w-full flex-col overflow-y-auto px-8 pb-24 pt-8">
      {/* Header section */}
      <div className="mb-2">
        <h1 className="font-semibold">
          {main?.type === "post" ? "案例讨论" : "意见征集"}
        </h1>
      </div>

      {/* Content section */}
      <div className="flex-1 space-y-6">
        {/* Title section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{main?.title}</h2>
          <Separator />
        </div>

        {itemPost("data")}
        {itemPost("reason")}
        {itemPost("issue")}
        {itemPost("plan")}
      </div>
    </div>
  );
}
