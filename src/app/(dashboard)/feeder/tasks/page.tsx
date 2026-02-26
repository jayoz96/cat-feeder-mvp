export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { OrderService } from "@/services/order-service";
import { TaskCard } from "./task-card";
import { Pagination } from "@/components/features/pagination";

const PAGE_SIZE = 5;

export default async function FeederTasksPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);

  const orders = OrderService.getOrders().filter(
    (o) => o.feederId === "feeder-1" && o.status !== "pending"
  );

  const active = orders.filter((o) => o.status === "accepted" || o.status === "in_progress");
  const pendingReview = orders.filter((o) => o.status === "pending_review");
  const allHistory = orders.filter((o) => o.status === "paid" || o.status === "completed");
  const history = allHistory.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/feeder">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">我的任务</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无任务，去接单大厅看看吧</p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">进行中</h2>
              {active.map((order) => (
                <TaskCard key={order.id} order={order} />
              ))}
            </section>
          )}

          {pendingReview.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">待审核</h2>
              {pendingReview.map((order) => (
                <TaskCard key={order.id} order={order} />
              ))}
            </section>
          )}

          {allHistory.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">
                历史订单（共 {allHistory.length} 条）
              </h2>
              {history.map((order) => (
                <TaskCard key={order.id} order={order} />
              ))}
              <Pagination total={allHistory.length} pageSize={PAGE_SIZE} basePath="/feeder/tasks" />
            </section>
          )}
        </>
      )}
    </div>
  );
}
