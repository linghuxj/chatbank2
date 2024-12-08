"use client";

import { SubHeader } from "@/components/header/sub-header";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ChevronRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const pdfUrl =
  "https://smtro.oss-cn-shenzhen.aliyuncs.com/common/%E6%B7%B1%E5%9C%B3%E5%B8%82%E5%89%8D%E6%B5%B7%E6%99%BA%E4%BB%95%E6%97%B6%E4%BB%A3%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8-%E7%A8%8E%E5%8A%A1%E7%BB%BC%E5%90%88%E6%8A%A5%E5%91%8A.pdf";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <SubHeader title="提升公司利润和竞争力的建议" />
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 p-8 md:max-w-3xl">
        <div className="flex flex-col gap-2">
          <div className="flex w-full items-center justify-between px-6">
            <span className="text-lg">AI-CFO</span>
            <span className="text-muted-foreground">
              {formatDistanceToNow(new Date("2024-12-08 12:00:00"), {
                addSuffix: true,
                locale: zhCN,
              })}
            </span>
          </div>
          <Separator />
          <div
            className="mt-6 flex w-full items-center justify-center gap-1"
            onClick={() => router.push(`/post/pdf?url=${pdfUrl}`)}
          >
            <span className="text-muted-foreground">根据财税诊断</span>
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-center text-lg">
            公司利润的上涨幅度显著低于收入涨幅
          </span>

          <div
            className="flex items-center justify-end gap-2"
            onClick={() =>
              router.push("/post/1129ee8a-774c-435f-ae7b-bf6b0440d5cf")
            }
          >
            <span className="text-blue-500">财税解读</span>
            <ChevronRight className="h-4 w-4 text-blue-500" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">增长的机会在</span>
          <span>
            当前，大多数企业（客户）都遇到增长乏力、利润下降的问题但无法有效解决；基于公司现有的财税诊断业务和资源，有望使这类普遍的问题得以有望解决。
          </span>

          <div
            className="flex items-center justify-end gap-2"
            onClick={() =>
              router.push("/post/d8b3a9b2-e589-4270-9411-29b0e2049341")
            }
          >
            <span className="text-blue-500">留言</span>
            <ChevronRight className="h-4 w-4 text-blue-500" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">解决方案</span>
          <span>
            针对有客户，在现有的财税诊断业务上，增加AI-CFO服务，实现增量业务：
          </span>
          <span>1 与客户建立更好的联系，发掘更多需求；</span>
          <span>2 提供持续的管理咨询服务，引导企业客户找到新的增长空间；</span>
          <span>3 逐渐在财税服务领域，形成公司的独特价值和竞争力</span>

          <div
            className="flex items-center justify-end gap-2"
            onClick={() =>
              router.push("/post/d8b3a9b2-e589-4270-9411-29b0e2049344")
            }
          >
            <span className="text-blue-500">留言</span>
            <ChevronRight className="h-4 w-4 text-blue-500" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">行动建议</span>
          <span>快速验证该项新业务是否成立：</span>
          <span>1 确认或对上述页面的结构和内容提出意见；</span>
          <span>
            2
            提供3-5家企业的财税诊断报告（去掉敏感信息），AI-CFO会对此做进一步分析，并持续收集各方意见，形成类似此页面的建议；
          </span>
          <span>3 将该页面转发客户，获得客户的反馈。并开启持续的互动。</span>

          <div
            className="flex items-center justify-end gap-2"
            onClick={() =>
              router.push("/post/d8b3a9b2-e589-4270-9411-29b0e2049345")
            }
          >
            <span className="text-blue-500">留言</span>
            <ChevronRight className="h-4 w-4 text-blue-500" />
          </div>
        </div>
      </div>
    </>
  );
}
