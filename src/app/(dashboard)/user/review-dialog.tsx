"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { Order } from "@/types";
import { reviewAndPay } from "./actions";
import { getCardById } from "@/lib/cat-photo-cards";

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0.5"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewDialog({
  open,
  onOpenChange,
  order,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  async function handlePay(method: string) {
    setLoading(true);
    try {
      const result = await reviewAndPay(order.id, rating, comment);
      if (result.success) {
        toast.success(`${method}支付成功，订单已完结`);
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>审核服务 & 支付</DialogTitle>
          <DialogDescription>
            请查看喂猫员的服务反馈，确认无误后完成支付
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* 喂猫员反馈内容 */}
          <div className="space-y-2">
            <p className="text-sm font-medium">服务反馈</p>
            {order.feedbackNote ? (
              <p className="text-sm text-muted-foreground bg-muted rounded-md p-3">
                {order.feedbackNote}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">暂无文字反馈</p>
            )}
          </div>

          {/* 照片墙 */}
          <div className="space-y-2">
            <p className="text-sm font-medium">服务照片</p>
            {order.feedbackPhotos && order.feedbackPhotos.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {order.feedbackPhotos.map((id) => {
                  const card = getCardById(id);
                  if (!card) return null;
                  return (
                    <div
                      key={id}
                      className={`aspect-square rounded-md flex flex-col items-center justify-center gap-1 ${card.bg}`}
                    >
                      <span className="text-3xl">{card.emoji}</span>
                      <span className="text-xs font-medium">{card.label}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">暂无服务照片</p>
            )}
          </div>

          {/* 评价 */}
          <div className="space-y-2">
            <p className="text-sm font-medium">服务评分</p>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">评价留言（选填）</p>
            <textarea
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="对喂猫员的服务有什么评价？"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* 费用信息 */}
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-sm text-muted-foreground">应付金额</span>
            <span className="text-xl font-bold">¥{order.totalPrice}</span>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            className="w-full bg-[#1677ff] hover:bg-[#4096ff] text-white"
            onClick={() => handlePay("支付宝")}
            disabled={loading}
          >
            {loading ? "支付中..." : "支付宝支付"}
          </Button>
          <Button
            className="w-full bg-[#07c160] hover:bg-[#38d97a] text-white"
            onClick={() => handlePay("微信")}
            disabled={loading}
          >
            {loading ? "支付中..." : "微信支付"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
