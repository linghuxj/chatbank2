"use client";

import { LatestPost } from "@/app/_components/post";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (session?.user) {
    void api.post.getLatest.useQuery();
  }

  return session?.user ? <LatestPost /> : <div>No session</div>;
}
