"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { Order } from "@/types";
import { CatAvatar } from "@/components/features/cat-avatar";
import { OrderStatusBadge } from "./order-status-badge";
import { ReviewDialog } from "./review-dialog";

export function UserOrderCard({ order }: { order: Order }) {
  const [showReview, setShowReview] = useState(false);

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
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>{order.address}</p>
          {order.notes && <p>备注：{order.notes}</p>}
          <p className="font-medium text-foreground">¥{order.totalPrice}</p>

          {order.status === "pending_review" && (
            <Button className="w-full" onClick={() => setShowReview(true)}>
              审核 & 支付
            </Button>
          )}
        </CardContent>
      </Card>

      {order.status === "pending_review" && (
        <ReviewDialog
          open={showReview}
          onOpenChange={setShowReview}
          order={order}
        />
      )}
    </>
  );
}
