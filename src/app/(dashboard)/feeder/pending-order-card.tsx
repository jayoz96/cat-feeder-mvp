"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cat, MapPin, Calendar, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Order } from "@/types";
import { acceptOrder } from "./actions";

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

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-1.5">
            <Cat className="h-4 w-4" />
            {order.catCount} 只猫
          </CardTitle>
          <span className="text-lg font-bold">¥{order.totalPrice}</span>
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
        </div>
        <Button className="w-full" onClick={handleAccept}>
          接单
        </Button>
      </CardContent>
    </Card>
  );
}
