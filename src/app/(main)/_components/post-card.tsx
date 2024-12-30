import Link from "next/link";
import { formatDistance } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostCardProps {
  post: any;
}

export function PostCard({ post }: PostCardProps) {
  const session = useSession();
  const router = useRouter();

  return (
    <div className="flex items-center justify-between gap-2">
      <Link
        href={`/main?id=${post.id}`}
        className="block flex-1 rounded-lg border p-4 transition-shadow hover:shadow-md"
      >
        <div className="line-clamp-2 flex items-start">
          <h2 className="text-lg font-semibold">{post.title}</h2>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{post.type === "post" ? "案例讨论" : "意见征集"}</span>
          <div className="flex items-center">
            <span className="mx-2">·</span>
            <span>
              {formatDistance(new Date(post.createdAt), new Date(), {
                addSuffix: true,
                locale: zhCN,
              })}
            </span>
            <span className="mx-2">·</span>
            <span>{post.viewCount} 次浏览</span>
          </div>
        </div>
      </Link>
      {session.data?.user.role === "admin" && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/main/new?id=${post.id}`)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
