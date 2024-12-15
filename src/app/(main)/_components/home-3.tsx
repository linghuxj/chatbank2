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

  return (
    <div className="flex h-full min-w-full flex-col p-8">
      {/* Content section */}
      <div className="flex-1 space-y-8">
        <div>
          <h2 className="text-2xl font-bold">基于财税诊断业务的发展建议</h2>
          <span className="mb-8 text-muted-foreground">@财智领航公司</span>

          <Separator className="my-8" />

          <div className={`${!isExpanded ? "space-y-32" : "space-y-12"}`}>
            <div className="flex flex-col space-y-2">
              <p className="text-center text-lg text-muted-foreground">
                财税数据显示
              </p>
              <div
                className={`relative ${
                  isExpanded ? "h-auto" : "h-6 overflow-hidden"
                } transition-all duration-200`}
              >
                <div className="space-y-2">
                  财税诊断业务2024年新增客户2000+，财税诊断实现收入XX万；目标客户转化率为X%，综合利润不足10%。
                  <br />
                  AI-CFO认为，影响利润的根本原因：
                  <br />
                  1 推广成本过高（渠道费、业务费、时间成本等等）；
                  <br />
                  2 高端客户转化比例不高；
                  <br />3 产品的复购率；
                </div>
              </div>
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
              <h3 className="text-center font-bold">现有财税诊断业务+AI-CFO</h3>
              <p className="text-muted-foreground">
                解决当下企业客户普遍关心的利润和增长问题。
              </p>
              <div className="flex justify-end">
                <div
                  onClick={onNext}
                  className="inline-flex items-center text-blue-500 hover:text-blue-600"
                >
                  详情
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-center font-bold">立即验证</h3>
              <div className="space-y-2">
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
      </div>

      {/* Footer section */}
      <div className="mb-6 mt-auto space-y-4">
        <Button
          variant="outline"
          className="mt-auto w-full"
          size="lg"
          onClick={onNext}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          疑问、意见或补充
        </Button>
        <div
          className="flex items-center justify-center text-muted-foreground"
          onClick={onNext}
        >
          收获更多办法
          <ChevronRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
