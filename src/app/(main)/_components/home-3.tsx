import { MessageCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Home3Props {
  onNext: () => void;
}

export default function Home3({ onNext }: Home3Props) {
  return (
    <div className="flex h-full min-w-full flex-col p-8">
      {/* Content section */}
      <div className="flex-1 space-y-8">
        <div>
          <h2 className="mb-8 text-center text-2xl font-bold">立即行动</h2>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-bold">快速验证新业务的设想是否成立:</h3>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  1. 邀请3-5家企业做一次线上座谈；
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

            <div className="space-y-4">
              <h3 className="font-bold">收获更多办法:</h3>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  在去掉敏感信息之后，将问题开放给更多用户讨论。
                </p>
                <div className="flex justify-end">
                  <div
                    onClick={onNext}
                    className="inline-flex items-center text-blue-500 hover:text-blue-600"
                  >
                    生成开放讨论页
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer section */}
      <div className="mb-6 mt-auto space-y-4">
        <div className="flex flex-col">
          <p className="text-muted-foreground">@财智领航公司</p>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-muted-foreground">
              以上是&quot;我&quot;面试&quot;的第一步工作结果，希望获得贵司的评价。
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="mt-auto w-full"
          size="lg"
          onClick={onNext}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          疑问、意见或补充
        </Button>
      </div>
    </div>
  );
}
