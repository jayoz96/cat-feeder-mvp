export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { OrderService } from "@/services/order-service";
import { UserOrderCard } from "./user-order-card";

export default function UserPage() {
  const orders = OrderService.getOrdersByUser("user-1");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">我的订单</h1>
        <Link href="/user/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            发布需求
          </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无订单，点击右上角发布喂猫需求吧</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <UserOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
