import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronUp } from "lucide-react";

export default function Home4() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);

  return (
    <div className="flex h-full min-w-full flex-col overflow-y-auto px-8 pb-14 pt-8">
      {/* Header section */}
      <div className="mb-6">
        <h1 className="font-semibold">案例讨论</h1>
      </div>

      {/* Content section */}
      <div className="flex-1 space-y-8">
        {/* Title section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            如何提升该项业务的利润和该公司的竞争力？
          </h2>
          <div className="space-y-2">
            <div
              className={`text-muted-foreground ${isExpanded ? "" : "line-clamp-1"}`}
            >
              某财税服务公司，代理某款财税诊断软件：企业只要输入纳税号，即可实时获得财税诊断报告。以此业务为基础，该公司进一步挖掘目标客户并提供持续的财税服务。
              <br />
              该业务2024年新增客户3000+，财税诊断实现收入XX万；目标客户转化率为X%，综合利润不足10%。
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center text-blue-500 hover:text-blue-600"
              >
                {isExpanded ? "收起" : "更多"}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Conflict description */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">冲突描述</h2>

          <div className="space-y-2">
            <h3 className="text-lg text-muted-foreground">财税数据显示</h3>
            <div className="text-muted-foreground">
              财税诊断业务的利润涨幅显著低于收入涨幅
            </div>
            <div className="flex justify-end">
              <Link
                href="/post/1129ee8a-774c-435f-ae7b-bf6b0440d5cf"
                className="inline-flex items-center text-blue-500 hover:text-blue-600"
              >
                财报解读
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg text-muted-foreground">
              影响利润的根本原因
            </h3>
            <div className="text-muted-foreground">
              产品的附加价值有限，使得竞争力不强
            </div>
            <div className="flex justify-end">
              <Link
                href="/post/d8b3a9b2-e589-4270-9411-29b0e2049345"
                className="inline-flex items-center text-blue-500 hover:text-blue-600"
              >
                根因分析
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Problems and challenges */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">问题与挑战</h2>
          <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
            <li>提升该项业务的利润；</li>
            <li>提升该公司的竞争力；</li>
          </ol>
        </div>

        {/* Current solution */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">当前方案</h2>
          <div className="space-y-2">
            <div
              className={`text-muted-foreground ${isExpanded2 ? "" : "line-clamp-2"}`}
            >
              在现有财税诊断业务的基础之上，向每个企业客户提供其专属的AI-CFO。
              <br />
              <br />
              <span className="text-lg font-bold text-foreground">
                帮助客户
              </span>
              <br />
              1
              从财税诊断开始，针对企业的问题，分析原因并提出合理方案，提供及时的行动建议；
              <br />
              2 有效解决当前企业客户普遍遇到的增⻓乏⼒、利润下滑等问题；
              <br />
              <br />
              <span className="text-lg font-bold text-foreground">
                帮助公司
              </span>
              <br />
              1
              解决当下企业（客户）普遍关心的增长问题，树立独特的价值主张，并开启具有长远潜力的业务空间；
              <br />
              2
              基于该公司成熟的业务、客户（渠道）和专家团队稳步创新；再根据确定的增长情况，引入新的合作者；
              <br />
              3 逐渐在财税服务领域，构建持续的竞争力；
              <br />
              4 与客户建⽴持续的联系，发掘更多需求；
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
    </div>
  );
}
