import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { OrderService } from "@/services/order-service";
import { OrderStatusBadge } from "./order-status-badge";

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
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {order.catCount} 只猫 · {order.startDate} ~ {order.endDate}
                  </CardTitle>
                  <OrderStatusBadge status={order.status} />
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>{order.address}</p>
                {order.notes && <p>备注：{order.notes}</p>}
                <p className="font-medium text-foreground">¥{order.totalPrice}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
