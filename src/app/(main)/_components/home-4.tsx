import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Home4() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);

  return (
    <div className="flex h-full min-w-full flex-col overflow-y-auto px-8 pb-24 pt-8">
      {/* Header section */}
      <div className="mb-2">
        <h1 className="font-semibold">案例讨论</h1>
      </div>

      {/* Content section */}
      <div className="flex-1 space-y-6">
        {/* Title section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            如何提升该项业务的利润和该公司的竞争力？
          </h2>
          <Separator />
        </div>

        {/* Conflict description */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">冲突描述</h2>

          <div className="space-y-2">
            <Link
              href="/post/d8b3a9b2-e589-4270-9411-29b0e2049345"
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
            >
              财税数据显示
              <ChevronRight className="h-4 w-4" />
            </Link>
            <div
              className={`text-muted-foreground ${isExpanded ? "" : "line-clamp-1"}`}
            >
              深圳某财税服务公司，代理某款财税诊断软件：企业只要输入纳税号，即可实时获得财税诊断报告。以此业务为基础，该公司挖掘目标客户并提供进一步的财税服务。
              <br />
              该业务2024年新增客户3000+，财税诊断实现收入XX万；目标客户转化率为X%，综合利润不足10%。
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center text-blue-500 hover:text-blue-600"
              >
                {isExpanded ? "收起" : "详情"}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </div>

            <Link
              href="/post/d8b3a9b2-e589-4270-9411-29b0e2049345"
              className="inline-flex items-center text-blue-500 hover:text-blue-600"
            >
              影响利润的根本原因
              <ChevronRight className="h-4 w-4" />
            </Link>
            <div className="text-muted-foreground">
              产品的附加价值有限，使得竞争力不强
            </div>
          </div>
        </div>

        {/* Problems and challenges */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">问题与挑战</h2>
          <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
            <li>提升该项业务的利润；</li>
            <li>提升该公司的竞争力；</li>
          </ol>
        </div>

        {/* Current solution */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">当前方案</h2>
          <div className="space-y-2">
            <div
              className={`text-muted-foreground ${isExpanded2 ? "" : "line-clamp-2"}`}
            >
              在该公司现有的财税诊断业务基础上，向每个企业客户提供其专属的AI-CFO
              ：
              <br />
              1. 解决当下企业（客户）普遍关心的利润和增长问题。
              <br />
              2.
              从财税诊断报告开始，针对企业的问题，提供持续的行动建议（告诉企业如何平稳创新、实现利润增长）；
              <br />
              <br />
              <span className="text-lg font-bold text-foreground">
                短期利润增加
              </span>
              <br />
              1. 可快速验证（新业务是否可行）；
              <br />
              2.
              基于该公司现有成熟的业务、客户（渠道）和专家团队，稳步实现增量业务；
              <br />
              3. 根据确定的增长情况，逐步引入新的合作者；
              <br />
              4. 与客户建⽴持续的联系，发掘更多需求。
              <br />
              <br />
              <span className="text-lg font-bold text-foreground">
                构建持续的竞争力
              </span>
              <br />
              1. 并开启具有长远潜力的业务空间；
              <br />
              2. 在财税服务领域向客户提供独特的价值，构建持续的竞争力；
              <br />
              <br />
            </div>
            <div className="flex flex-col items-end justify-end">
              <div
                onClick={() => setIsExpanded2(!isExpanded2)}
                className="inline-flex items-center text-blue-500 hover:text-blue-600"
              >
                {isExpanded2 ? "收起" : "更多"}
                {isExpanded2 ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>
            <Link
              href="/post/d8b3a9b2-e589-4270-9411-29b0e2049341"
              className="inline-flex items-center text-blue-500 hover:text-blue-600"
            >
              方案讨论
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
