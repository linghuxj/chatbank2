import { SubHeader } from "@/components/header/sub-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Share() {
  return (
    <>
      <SubHeader title="邀请函" />
      <div className="flex h-[calc(100vh-64px)] min-w-full flex-col space-y-8 p-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">诚邀您参与线上讨论</h2>
          <h2 className="text-xl font-bold">---- 有效提升贵司现有业务的利润</h2>
        </div>

        <Separator />

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-semibold">@XXX公司XX总：</h2>
            <p className="text-muted-foreground">
              财税诊断报告显示，贵司的XXX业务，有较大的利润提升空间。
            </p>
            <p className="text-muted-foreground">
              为有效的提升贵司利润、打造持续的竞争力，我司即将推出AI-CFO（数智财务官），为贵司提供持续的发展建议。
            </p>
            <p className="text-muted-foreground">
              现特邀请贵司高管参与线上原理体验会。
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">会议链接</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>1 腾讯会议：11-111-11111；</li>
              <li>2 时间：暂定XX日14:00-15:30；</li>
              <li>3 参与人数：5-6家企业的高管；</li>
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
