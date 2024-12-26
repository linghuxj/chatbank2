"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@lobehub/ui";
import { Loader2 } from "lucide-react";

export default function Business3InputForm({
  value,
  title,
  onChange,
  onTitleChange,
  onPrev,
  onSubmit,
  loading,
}: {
  value: string;
  title: string;
  onChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onPrev: () => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <div className="mt-24 flex h-full min-w-full flex-col p-8">
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold">您认为造成问题的原因是什么？</h1>

        <div className="text-sm text-muted-foreground">
          <p className="mb-2">例如：</p>
          <p>市场上同类产品比较多，竞争激烈；</p>
          <p>或过往的成功案例较少；</p>
        </div>

        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="写点什么。。"
          className="min-h-[200px] resize-none"
        />

        <Separator className="my-4" />

        <div className="text-sm text-muted-foreground">
          <p className="mb-2">例如：</p>
          <p>如何提升该项业务的利润和该公司的竞争力？</p>
        </div>

        <Textarea
          placeholder="为当前业务起个吸引力的标题"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="min-h-[100px] resize-none"
        />

        <div className="mt-6 flex gap-4">
          <Button
            className="flex-1"
            variant="outline"
            onClick={onPrev}
            disabled={loading}
          >
            上一步
          </Button>
          <Button
            className="flex-1"
            onClick={onSubmit}
            disabled={loading || !title}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>发表中...</span>
              </div>
            ) : (
              "发表"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
