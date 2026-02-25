"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cat, ClipboardList, User } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFeeder = pathname.startsWith("/feeder");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Cat className="h-5 w-5" />
            <span>喵了个护</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/user"
              className={pathname.startsWith("/user") ? "text-primary font-medium" : "text-muted-foreground"}
            >
              铲屎官
            </Link>
            <Link
              href="/feeder"
              className={isFeeder ? "text-primary font-medium" : "text-muted-foreground"}
            >
              喂猫员
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      <nav className="border-t bg-background sticky bottom-0 md:hidden">
        <div className="flex justify-around py-2">
          <Link href="/user" className="flex flex-col items-center gap-1 text-xs">
            <ClipboardList className="h-5 w-5" />
            <span>订单</span>
          </Link>
          <Link href="/feeder" className="flex flex-col items-center gap-1 text-xs">
            <Cat className="h-5 w-5" />
            <span>接单</span>
          </Link>
          <Link href="/user" className="flex flex-col items-center gap-1 text-xs">
            <User className="h-5 w-5" />
            <span>我的</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
