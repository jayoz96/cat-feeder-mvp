export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { OrderService } from "@/services/order-service";
import { DiaryEntry } from "./diary-entry";

export default async function DiaryPage() {
  const allOrders = OrderService.getOrdersByUser("user-1");
  const paidOrders = allOrders
    .filter((o) => o.status === "paid" && (o.feedbackPhotos?.length || o.feedbackNote))
    .sort((a, b) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/user">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">猫咪日记</h1>
      </div>

      {paidOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无日记，完成订单后会自动生成</p>
        </div>
      ) : (
        <div className="relative pl-6 border-l-2 border-muted space-y-6">
          {paidOrders.map((order) => (
            <DiaryEntry key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
