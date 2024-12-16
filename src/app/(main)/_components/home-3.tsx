import { useState } from "react";
import {
  MessageCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface Home3Props {
  onNext: () => void;
}

export default function Home3({ onNext }: Home3Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);

  return (
    <div className="flex h-full min-w-full flex-col overflow-y-auto p-8">
      {/* Content section */}
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">基于财税诊断业务的发展建议</h2>
          <span className="mb-8 text-muted-foreground">@财智领航公司</span>

          <Separator className="my-4" />

          <div className="space-y-8">
            <div className="flex flex-col space-y-2">
              <p className="text-center text-lg text-muted-foreground">
                财税数据显示
              </p>
              {!isExpanded ? (
                <div>贵司的财税诊断业务，有较大的利润提升空间。</div>
              ) : (
                <div className="flex flex-col">
                  财税诊断业务2024年新增客户2000+，财税诊断实现收入XX万；目标客户转化率为X%，综合利润不足10%。
                  <span className="mt-2 font-semibold">
                    AI-CFO认为，影响利润的根本原因：
                  </span>
                  <p>1 推广成本过高（渠道费、业务费、时间成本等等）；</p>
                  <p>2 高端客户转化比例不高；</p>
                  <p>3 产品的复购率；</p>
                </div>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 flex items-center self-end text-blue-500 hover:text-blue-600"
              >
                {isExpanded ? (
                  <>
                    收起 <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    详情 <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              <p className="text-center text-lg text-muted-foreground">
                建议方案
              </p>
              <h3 className="font-bold">
                为每一位财税诊断的企业客户提供其专属的AI-CFO(数智财务官)
              </h3>
              {!isExpanded2 ? (
                <p className="text-muted-foreground">
                  解决当下企业客户普遍关心的利润和增长问题。
                </p>
              ) : (
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col text-muted-foreground">
                    <p>1. 解决当下企业客户普遍关心的利润和增长问题。</p>
                    <p>
                      2.
                      从财税诊断报告开始，针对企业的问题，提供持续的行动建议(告诉企业如何做，能实现平稳创新和利润增长);
                    </p>
                  </div>
                  <div className="flex flex-col text-muted-foreground">
                    <span className="mb-2 font-bold text-primary">
                      快速实现增量业务，使短期利润增加
                    </span>
                    <p>1 可快速验证(新业务是否可行);</p>
                    <p>
                      2
                      基于贵司现有成熟的业务、客户(渠道)和专家团队，稳步实现增量业务;由我方提供
                      AI-CFO; 根据确定的增长，再逐步引入新的合作者;
                    </p>
                    <p>3 与客户建立持续的联系，发掘更多需求。</p>
                  </div>
                  <div className="flex flex-col text-muted-foreground">
                    <span className="mb-2 font-bold text-primary">
                      构建持续的竞争力
                    </span>
                    <p>
                      1
                      用工具（方法）解决当前企业客户遇到的普遍问题，开启具有长远潜力的业务空间;
                    </p>
                    <p>
                      2 在财税服务领域向客户提供独特的价值，构建持续的竞争力;
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsExpanded2(!isExpanded2)}
                  className="mt-2 flex items-center self-end text-blue-500 hover:text-blue-600"
                >
                  {isExpanded2 ? (
                    <>
                      收起 <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      详情 <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <p className="text-center text-lg text-muted-foreground">
                立即验证
              </p>
              <h3 className="font-bold">快速验证新业务的设想是否成立:</h3>
              <p className="text-muted-foreground">
                1. 邀请5-6家企业，做一次线上体验；
              </p>
              <div className="flex justify-end">
                <Link
                  href="/share"
                  className="inline-flex items-center text-blue-500 hover:text-blue-600"
                >
                  生成邀请函
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer section */}
      <div className="mb-6 mt-auto space-y-4">
        <Button
          variant="outline"
          className="mt-auto w-full"
          size="lg"
          onClick={() => onNext()}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          疑问、意见或补充
        </Button>
        <div
          className="flex items-center justify-center text-muted-foreground"
          onClick={() => onNext()}
        >
          收获更多办法
          <ChevronRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
