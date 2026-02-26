export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import { OrderService } from "@/services/order-service";
import { PendingOrderCard } from "./pending-order-card";

export default function FeederPage() {
  const pendingOrders = OrderService.getPendingOrders();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">接单大厅</h1>
        <Link href="/feeder/tasks">
          <Button variant="outline">
            <ClipboardList className="h-4 w-4 mr-2" />
            我的任务
          </Button>
        </Link>
      </div>

      {pendingOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无可接订单，稍后再来看看吧</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingOrders.map((order) => (
            <PendingOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
