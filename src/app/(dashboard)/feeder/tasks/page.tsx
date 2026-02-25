import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { OrderService } from "@/services/order-service";
import { TaskCard } from "./task-card";

export default function FeederTasksPage() {
  const orders = OrderService.getOrders().filter(
    (o) => o.feederId === "feeder-1" && o.status !== "pending"
  );

  const active = orders.filter((o) => o.status === "accepted" || o.status === "in_progress");
  const completed = orders.filter((o) => o.status === "completed");

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

          {completed.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">已完成</h2>
              {completed.map((order) => (
                <TaskCard key={order.id} order={order} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
