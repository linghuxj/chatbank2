import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface Home1Props {
  onNext: () => void;
}

export default function Home1({ onNext }: Home1Props) {
  return (
    <div className="flex h-full min-w-full flex-col p-8">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">提升利润和竞争力的行动建议</h1>
        <div className="text-muted-foreground">@财智领航公司</div>
      </div>

      {/* Content section */}
      <div className="flex-1 space-y-8">
        {/* Quote section */}
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-muted-foreground">
            &quot;我将成为贵司专属的AI-CFO。在正式上岗前，希望通过解决贵司一个真实的业务问题，以获得贵司的认可。&quot;
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">
            提升财税诊断业务的利润，并构建公司持续的竞争力
          </h2>

          <div className="space-y-2">
            <h3 className="font-semibold">财税数据显示</h3>
            <p className="text-muted-foreground">
              财税诊断业务的利润涨幅显著低于收入涨幅
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">影响利润的根本原因</h3>
            <p className="text-muted-foreground">
              产品的附加价值有限，使得竞争力不强：
            </p>
            <ul className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>推广成本过高（渠道费、业务费、时间成本等等）；</li>
              <li>高端客户转化比例不高；</li>
              <li>产品的复购率；</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer button */}
      <Button
        variant="outline"
        className="mb-6 w-full"
        size="lg"
        onClick={onNext}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        疑问、意见或补充
      </Button>
    </div>
  );
}
