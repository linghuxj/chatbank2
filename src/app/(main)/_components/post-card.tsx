import Link from "next/link";
import { formatDistance } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

      <div className="mt-4 flex items-center text-sm text-gray-500">
        <Avatar className="mr-2 h-6 w-6">
          <AvatarImage
            alt={post.user.nickname ?? ""}
            src={post.user.image ?? "/placeholder.svg"}
          />
          <AvatarFallback>
            {post.user.nickname
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span>{post.user.name}</span>
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
    </Link>
  );
}
