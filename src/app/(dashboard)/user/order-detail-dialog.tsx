"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, MapPin, Calendar, Cat, Clock } from "lucide-react";
import { Order } from "@/types";
import { getCardById } from "@/lib/cat-photo-cards";

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= value
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

export function OrderDetailDialog({
  open,
  onOpenChange,
  order,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>订单详情</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* 基本信息 */}
          <div className="space-y-1.5 text-sm">
            <p className="flex items-center gap-1.5">
              <Cat className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">{order.catCount} 只猫</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              {order.startDate} ~ {order.endDate}
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              {order.address}
            </p>
            {order.notes && (
              <p className="text-muted-foreground">备注：{order.notes}</p>
            )}
          </div>

          {/* 费用 */}
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-sm text-muted-foreground">已支付</span>
            <span className="text-lg font-bold">¥{order.totalPrice}</span>
          </div>

          {/* 服务时间线 */}
          {order.checkIns && order.checkIns.length > 0 && (
            <div className="space-y-2 border-t pt-3">
              <p className="text-sm font-medium">服务时间线</p>
              <div className="relative pl-5 border-l-2 border-muted space-y-3">
                {order.checkIns.map((ci) => (
                  <div key={ci.id} className="relative">
                    <div className="absolute -left-[25px] top-0.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                    <p className="text-xs text-muted-foreground">
                      {new Date(ci.createdAt).toLocaleString("zh-CN")}
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {ci.type === "arrive" ? "到达签到" : "离开签退"}
                    </p>
                    {ci.note && <p className="text-xs text-muted-foreground">{ci.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 服务反馈 */}
          <div className="space-y-2 border-t pt-3">
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
          {order.feedbackPhotos && order.feedbackPhotos.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">服务照片</p>
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
            </div>
          )}

          {/* 评价 */}
          {order.userRating && (
            <div className="space-y-2 border-t pt-3">
              <p className="text-sm font-medium">我的评价</p>
              <StarDisplay value={order.userRating} />
              {order.reviewComment && (
                <p className="text-sm text-muted-foreground">{order.reviewComment}</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
