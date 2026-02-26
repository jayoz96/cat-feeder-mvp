"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { Order } from "@/types";
import { CatAvatar } from "@/components/features/cat-avatar";
import { OrderDetailDialog } from "../order-detail-dialog";

export function HistoryOrderCard({ order }: { order: Order }) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <CatAvatar catCount={order.catCount} />
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-base">
                  {order.catCount} 只猫 · {order.startDate} ~ {order.endDate}
                </CardTitle>
                {order.urgent && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-100 text-orange-700 px-1.5 py-0.5 text-[11px] font-medium">
                    <Zap className="h-3 w-3" />
                    加急
                  </span>
                )}
              </div>
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">
                已完成
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>{order.address}</p>
          <div className="flex items-center justify-between">
            <p className="font-medium text-foreground">¥{order.totalPrice}</p>
            <Button variant="outline" size="sm" onClick={() => setShowDetail(true)}>
              查看详情
            </Button>
          </div>
        </CardContent>
      </Card>

      <OrderDetailDialog
        open={showDetail}
        onOpenChange={setShowDetail}
        order={order}
      />
    </>
  );
}
