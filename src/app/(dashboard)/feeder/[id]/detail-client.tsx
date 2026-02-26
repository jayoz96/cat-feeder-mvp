"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Sparkles, Cat } from "lucide-react";
import { Order } from "@/types";
import { CatAvatar } from "@/components/features/cat-avatar";
import { NavButton } from "@/components/features/nav-button";
import { ChatWindow } from "@/components/features/chat-window";
import { OrderStatusBadge } from "../../user/order-status-badge";
import { acceptOrder } from "../actions";

export function OrderDetailClient({ order }: { order: Order }) {
  const router = useRouter();

  async function handleAccept() {
    const result = await acceptOrder(order.id);
    if (result.success) {
      toast.success(result.message);
      router.push("/feeder/tasks");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="space-y-4">
      {/* 订单信息卡片 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <CatAvatar catCount={order.catCount} />
            <div className="flex-1 flex items-center justify-between">
              <CardTitle className="text-base">
                {order.catCount} 只猫
              </CardTitle>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {order.startDate} ~ {order.endDate}
            </p>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {order.address}
              </p>
              <NavButton address={order.address} />
            </div>
            {order.notes && (
              <div className="bg-muted rounded-md p-3 text-sm">
                <p className="font-medium text-foreground mb-1">备注</p>
                <p>{order.notes}</p>
              </div>
            )}
          </div>

          {/* 费用明细 */}
          <div className="border-t pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>单价</span>
              <span>¥{order.pricePerDay} / 天 / 只</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>合计</span>
              <span>¥{order.totalPrice}</span>
            </div>
          </div>

          {order.status === "pending" && (
            <Button className="w-full" onClick={handleAccept}>
              接单
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 聊天窗口 */}
      <ChatWindow orderId={order.id} />
    </div>
  );
}
