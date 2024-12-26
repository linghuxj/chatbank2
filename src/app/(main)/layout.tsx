import { MobileNav } from "@/components/mobile-nav";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col pb-[4.5rem]">
      {children}
      <MobileNav />
    </div>
  );
}
