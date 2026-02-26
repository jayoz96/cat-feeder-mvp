"use client";

import { useState } from "react";
import { Order } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { ReviewDialog } from "./review-dialog";

export function PendingReviewAlert({ orders }: { orders: Order[] }) {
  const [dismissed, setDismissed] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);

  if (orders.length === 0 || dismissed) return null;

  return (
    <>
      <Dialog open={!reviewOrder} onOpenChange={(open) => { if (!open) setDismissed(true); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              有 {orders.length} 个订单等待审核
            </DialogTitle>
            <DialogDescription>
              喂猫员已完成服务并提交了反馈，请尽快审核并完成支付
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2 max-h-60 overflow-y-auto">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="text-sm space-y-0.5">
                  <p className="font-medium">{order.catCount} 只猫 · ¥{order.totalPrice}</p>
                  <p className="text-muted-foreground text-xs">{order.address}</p>
                </div>
                <Button size="sm" onClick={() => setReviewOrder(order)}>
                  去审核
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDismissed(true)}>
              稍后再说
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {reviewOrder && (
        <ReviewDialog
          open={!!reviewOrder}
          onOpenChange={(open) => { if (!open) { setReviewOrder(null); setDismissed(true); } }}
          order={reviewOrder}
        />
      )}
    </>
  );
}
