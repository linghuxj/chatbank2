import { SubHeader } from "@/components/header/sub-header";
import { Button } from "@/components/ui/button";

export default function Share() {
  return (
    <>
      <SubHeader title="诚邀您参与线上讨论" />
      <div className="flex h-[calc(100vh-64px)] min-w-full flex-col space-y-8 p-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">如何有效提升贵司的利润和竞争力</h2>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              为了能给贵司提供更好的服务，我司即将推出AI-CFO（数智财务官）：
            </p>
            <p className="text-muted-foreground">
              从财税诊断开始；为有效提升贵司的利润和竞争力，提供持续的行动建议。
            </p>
            <p className="text-muted-foreground">
              拟定于XXX日与专家召开线上讨论，先行体验方法是否对贵司有效。
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">会议链接</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>1 腾讯会议：11-111-11111；</li>
              <li>2 暂定XX日14:00-15:30，具体时间商议后确定；</li>
              <li>3 参与人数：3-5家企业的高管；</li>
            </ul>
          </div>

          <div className="flex gap-4 sm:flex-row">
            <Button className="flex-1" size="lg">
              参与
            </Button>
            <Button variant="outline" className="flex-1" size="lg">
              会议时间协商
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
