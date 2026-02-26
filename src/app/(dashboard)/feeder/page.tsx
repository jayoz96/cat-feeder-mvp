export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClipboardList, User } from "lucide-react";
import { OrderService } from "@/services/order-service";
import { PendingOrderCard } from "./pending-order-card";
import { Pagination } from "@/components/features/pagination";

const PAGE_SIZE = 5;

export default async function FeederPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const allPending = OrderService.getPendingOrders();
  const pendingOrders = allPending.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

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

      {allPending.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无可接订单，稍后再来看看吧</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <PendingOrderCard key={order.id} order={order} />
            ))}
          </div>
          <Pagination total={allPending.length} pageSize={PAGE_SIZE} basePath="/feeder" />
        </>
      )}
    </div>
  );
}
