"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cat, MapPin, Calendar, Sparkles, Zap } from "lucide-react";
import { Order } from "@/types";
import { CatAvatar } from "@/components/features/cat-avatar";
import { NavButton } from "@/components/features/nav-button";
import { acceptOrder } from "./actions";
import Link from "next/link";

/** 简单的 AI 推荐逻辑：猫多、价格高、日期近的订单优先推荐 */
function isAiRecommended(order: Order): boolean {
  const daysUntilStart = Math.ceil(
    (new Date(order.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return order.catCount >= 2 || order.totalPrice >= 300 || daysUntilStart <= 5;
}

export function PendingOrderCard({ order }: { order: Order }) {
  const router = useRouter();

  async function handleAccept() {
    const result = await acceptOrder(order.id);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  const recommended = isAiRecommended(order);

  return (
    <Card className={recommended ? "ring-1 ring-violet-300" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <CatAvatar catCount={order.catCount} />
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">
                {order.catCount} 只猫
              </CardTitle>
              {order.urgent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-[11px] font-medium">
                  <Zap className="h-3 w-3" />
                  加急
                </span>
              )}
              {recommended && (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 text-violet-700 px-2 py-0.5 text-[11px] font-medium">
                  <Sparkles className="h-3 w-3" />
                  AI 推荐
                </span>
              )}
            </div>
            <span className="text-lg font-bold">¥{order.totalPrice}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-muted-foreground space-y-1">
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
          {order.notes && <p>备注：{order.notes}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Link href={`/feeder/${order.id}`}>
            <Button variant="outline" className="w-full">
              查看详情
            </Button>
          </Link>
          <Button className="w-full" onClick={handleAccept}>
            接单
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
