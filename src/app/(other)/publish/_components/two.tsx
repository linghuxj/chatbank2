"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Business2InputForm({
  value,
  onChange,
  onNext,
  onPrev,
}: {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div className="mt-24 flex h-full min-w-full flex-col p-8">
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold">请描述您的业务问题</h1>

        <div className="text-sm text-muted-foreground">
          <p className="mb-2">例如：</p>
          <p>想扩大业务规模，并提高端客户的转换率。</p>
          <p>
            2024年该业务新增客户XXX，该业务实现收入XX万；高端客户转化率仅为X%。
          </p>
        </div>

        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="写点什么。。"
          className="min-h-[200px] resize-none"
        />

        <div className="mt-6 flex gap-4">
          <Button className="flex-1" variant="outline" onClick={onPrev}>
            上一步
          </Button>
          <Button className="flex-1" onClick={onNext}>
            发表
          </Button>
        </div>
      </div>
    </div>
  );
}
