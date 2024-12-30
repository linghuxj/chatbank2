import Link from "next/link";
import { formatDistance } from "date-fns";
import { zhCN } from "date-fns/locale";

interface PostCardProps {
  post: any;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/main?id=${post.id}`}
      className="block rounded-lg border p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{post.title}</h2>
        </div>
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
  );
}
