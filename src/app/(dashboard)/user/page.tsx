export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Cat, History } from "lucide-react";
import { OrderService } from "@/services/order-service";
import { UserOrderCard } from "./user-order-card";
import { PendingReviewAlert } from "./pending-review-alert";
import { Pagination } from "@/components/features/pagination";

const PAGE_SIZE = 5;

export default async function UserPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const allOrders = OrderService.getOrdersByUser("user-1");
  const activeOrders = allOrders.filter((o) => o.status !== "paid");
  const pendingReviewOrders = allOrders.filter((o) => o.status === "pending_review");
  const orders = activeOrders.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PendingReviewAlert orders={pendingReviewOrders} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">我的订单</h1>
        <div className="flex gap-2">
          <Link href="/user/history">
            <Button variant="outline" size="sm">
              <History className="h-4 w-4 mr-1" />
              历史订单
            </Button>
          </Link>
          <Link href="/user/cats">
            <Button variant="outline" size="sm">
              <Cat className="h-4 w-4 mr-1" />
              猫咪档案
            </Button>
          </Link>
          <Link href="/user/create">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-1" />
              发布需求
            </Button>
          </Link>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无订单，点击右上角发布喂猫需求吧</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {orders.map((order) => (
              <UserOrderCard key={order.id} order={order} />
            ))}
          </div>
          <Pagination total={activeOrders.length} pageSize={PAGE_SIZE} basePath="/user" />
        </>
      )}
    </div>
  );
}
