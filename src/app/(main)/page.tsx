"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { api } from "@/trpc/react";

export default function HomePage() {
  const { data: mains } = api.main.getByUserId.useQuery();

  return (
    <div className="mx-auto flex w-full flex-col p-6">
      <main className="flex-1 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">AI-CFO,</h1>
          <h2 className="text-2xl font-semibold">实现增长的行动指南</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>基于业务现状的有效创新</p>
            <p>兼顾短期收入和持续的竞争力</p>
            <p>最小试错成本</p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-24 pt-32 text-center">
          <Link
            href={!mains ? `/publish` : `/main?id=${mains.id}`}
            className="flex items-center text-blue-600 transition-colors hover:text-blue-700"
          >
            <span>{!mains ? "现有业务改进" : "查看已有业务改进"}</span>
            <ChevronRight className="h-5 w-5" />
          </Link>

          <Link href="#" className="flex items-center text-muted-foreground">
            <span>创新想法落地</span>
            <ChevronRight className="h-5 w-5" />
          </Link>

          <Link href="#" className="flex items-center text-muted-foreground">
            <span>能力资源变现</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
