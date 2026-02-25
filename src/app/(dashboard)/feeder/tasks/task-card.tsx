"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cat, MapPin, Calendar, Play, CheckCircle } from "lucide-react";
import { Order } from "@/types";
import { OrderStatusBadge } from "../../user/order-status-badge";
import { startTask } from "./actions";
import { CompleteDialog } from "./complete-dialog";

export function TaskCard({ order }: { order: Order }) {
  const router = useRouter();
  const [showComplete, setShowComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    setLoading(true);
    try {
      const result = await startTask(order.id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-1.5">
              <Cat className="h-4 w-4" />
              {order.catCount} 只猫 · ¥{order.totalPrice}
            </CardTitle>
            <OrderStatusBadge status={order.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {order.startDate} ~ {order.endDate}
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {order.address}
            </p>
            {order.notes && <p>备注：{order.notes}</p>}
            {order.feedbackNote && (
              <p className="pt-1 text-foreground">反馈：{order.feedbackNote}</p>
            )}
          </div>

          {order.status === "accepted" && (
            <Button className="w-full" onClick={handleStart} disabled={loading}>
              <Play className="h-4 w-4 mr-2" />
              {loading ? "签到中..." : "开始服务（签到）"}
            </Button>
          )}

          {order.status === "in_progress" && (
            <Button className="w-full" onClick={() => setShowComplete(true)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              完成服务（签退）
            </Button>
          )}
        </CardContent>
      </Card>

      <CompleteDialog
        open={showComplete}
        onOpenChange={setShowComplete}
        orderId={order.id}
      />
    </>
  );
}
