export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClipboardList, User } from "lucide-react";
import { OrderService } from "@/services/order-service";
import { MOCK_USERS } from "@/services/mock-data";
import { PendingOrderCard } from "./pending-order-card";
import { SortToggle } from "./sort-toggle";
import { Pagination } from "@/components/features/pagination";

const PAGE_SIZE = 5;

export default async function FeederPage({ searchParams }: { searchParams: Promise<{ page?: string; sort?: string }> }) {
  const { page, sort } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const sortMode = sort === "time" ? "time" : "distance";

  // 获取喂猫员位置
  const feeder = MOCK_USERS.find((u) => u.id === "feeder-1");
  const feederLocation = feeder?.location ?? { lat: 31.9450, lng: 118.8300 };

  // 按距离排序：返回 [order, distanceKm] 元组
  const withDistance = OrderService.getPendingOrdersSorted(feederLocation);

  // 按时间排序时重新排，但保留距离信息用于显示
  const allSorted = sortMode === "time"
    ? [...withDistance].sort((a, b) => new Date(b[0].createdAt).getTime() - new Date(a[0].createdAt).getTime())
    : withDistance;

  const pageSlice = allSorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">接单大厅</h1>
        <div className="flex gap-2">
          <Link href="/feeder/profile">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-1" />
              个人主页
            </Button>
          </Link>
          <Link href="/feeder/tasks">
            <Button variant="outline" size="sm">
              <ClipboardList className="h-4 w-4 mr-1" />
              我的任务
            </Button>
          </Link>
        </div>
      </div>

      {allSorted.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无可接订单，稍后再来看看吧</p>
        </div>
      ) : (
        <>
          <SortToggle />
          <div className="space-y-3">
            {pageSlice.map(([order, distance]) => (
              <PendingOrderCard key={order.id} order={order} distanceKm={distance} />
            ))}
          </div>
          <Pagination total={allSorted.length} pageSize={PAGE_SIZE} basePath="/feeder" />
        </>
      )}
    </div>
  );
}
