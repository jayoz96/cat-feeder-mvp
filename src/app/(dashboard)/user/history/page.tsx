export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { OrderService } from "@/services/order-service";
import { HistoryOrderCard } from "./history-order-card";
import { Pagination } from "@/components/features/pagination";

const PAGE_SIZE = 5;

export default async function HistoryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const allOrders = OrderService.getOrdersByUser("user-1");
  const paidOrders = allOrders.filter((o) => o.status === "paid");
  const orders = paidOrders.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/user">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">历史订单</h1>
        </div>
      </div>

      {paidOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无历史订单</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {orders.map((order) => (
              <HistoryOrderCard key={order.id} order={order} />
            ))}
          </div>
          <Pagination total={paidOrders.length} pageSize={PAGE_SIZE} basePath="/user/history" />
        </>
      )}
    </div>
  );
}
