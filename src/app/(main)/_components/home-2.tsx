import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Home2Props {
  onNext: () => void;
}

export default function Home2({ onNext }: Home2Props) {
  return (
    <div className="flex h-full min-w-full flex-col p-8">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">提升利润和竞争力的行动建议</h1>
      </div>

      {/* Content section */}
      <div className="flex-1 space-y-8">
        <div>
          <h2 className="mb-4 text-lg text-muted-foreground">解决方案</h2>
          <h3 className="mb-4 text-xl font-bold">
            用AI-CFO(数智财税官)，构建全新的增值业务
          </h3>
          <p className="text-muted-foreground">
            在现有财税诊断业务的基础之上，向每个企业客户提供其专属的AI-CFO
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-lg font-bold">帮助客户</h3>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                从财税诊断开始，针对企业的问题，分析原因并提出合理方案，提供及时的行动建议；
              </li>
              <li>有效解决当前企业客户普遍遇到的增长乏力、利润下滑等问题；</li>
            </ol>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-bold">帮助公司</h3>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                解决当下企业（客户）普遍关心的增长问题，树立独特的价值主张，并开启具有长远潜力的业务空间；
              </li>
              <li>
                基于成熟的业务、客户（渠道）和专家团队稳步创新；再根据确定的增长情况，引入新的合作者；
              </li>
              <li>逐渐在财税服务领域，构建持续的竞争力；</li>
              <li>与客户建立持续的联系，发掘更多需求；</li>
            </ol>
          </div>
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
