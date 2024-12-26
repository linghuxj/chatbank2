"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Business1InputForm({
  value,
  onChange,
  onNext,
}: {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex h-full min-w-full flex-col p-8 mt-24">
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold">请输入您需要改进的业务</h1>

        <div className="text-sm text-muted-foreground">
          <p className="mb-2">例如：</p>
          <p>
            我司代理了某款财税诊断软件。企业只要输入纳税号，即可实时获得财税诊断报告。
          </p>
          <p>以此为基础，我到高端客户并提供进一步的财税服务。</p>
        </div>

        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="写点什么。。"
          className="min-h-[200px] resize-none"
        />

        <div className="mt-6 flex gap-4">
          <Button className="flex-1" onClick={onNext}>
            发表
          </Button>
        </div>
      </div>
    </div>
  );
}
