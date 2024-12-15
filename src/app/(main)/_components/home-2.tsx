import { MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface Home2Props {
  onNext: () => void;
}

export default function Home2({ onNext }: Home2Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  return (
    <div className="flex h-full min-w-full flex-col p-8">
      {/* Content section */}
      <div className="flex-1 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold">用AI-CFO快速实现利润增加</h2>
          <span className="mb-8 text-muted-foreground">
            并开启具有长远潜力的业务空间
          </span>
        </div>

        <Separator />

        <div className="space-y-8">
          <div className="flex flex-col space-y-2">
            <p className="text-center text-lg text-muted-foreground">
              为每一位财税诊断的企业客户提供
            </p>
            <h2 className="text-center text-xl font-semibold">
              专属AI-CFO（数智财务官）
            </h2>
            {isExpanded && (
              <div className="flex flex-col space-y-2">
                <span>1 解决当下企业客户普遍关心的利润和增长问题。</span>
                <span>
                  2
                  从财税诊断报告开始，针对企业的问题，提供持续的行动建议（告诉企业如何如何平稳创新，实现利润增长）；
                </span>
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
            <h3 className="mb-3 text-lg font-bold">短期利润增加</h3>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>可快速验证（新业务是否可行）；</li>
              <li>
                基于贵司现有成熟的业务、客户（渠道）和专家团队，稳步实现增量业务；由我方提供AI-CFO；
              </li>
              {isExpanded2 && <li>根据确定的增长情况，逐步引入新的合作者；</li>}
              {isExpanded2 && <li>与客户建⽴持续的联系，发掘更多需求。</li>}
            </ol>
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
          <h3 className="mb-3 text-lg font-bold">构建持续的竞争力</h3>
          <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
            <li>并开启具有长远潜力的业务空间；</li>
            <li>在财税服务领域向客户提供独特的价值，构建持续的竞争力；</li>
          </ol>
        </div>
      </div>

      {/* Footer button */}
      <Button
        variant="outline"
        className="mb-6 mt-auto w-full"
        size="lg"
        onClick={onNext}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        疑问、意见或补充
      </Button>
    </div>
  );
}
