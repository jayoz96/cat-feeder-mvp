"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Order } from "@/types";
import { getCardById } from "@/lib/cat-photo-cards";

export function DiaryEntry({ order }: { order: Order }) {
  const date = order.completedAt?.split("T")[0] || order.createdAt;

  return (
    <div className="relative">
      <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-primary border-2 border-background" />
      <p className="text-xs text-muted-foreground mb-1.5">{date}</p>
      <Card>
        <CardContent className="pt-4 space-y-3">
          <p className="text-sm font-medium">{order.catCount} 只猫 · {order.address}</p>

          {order.feedbackNote && (
            <p className="text-sm text-muted-foreground bg-muted rounded-md p-2.5">
              {order.feedbackNote}
            </p>
          )}

          {order.feedbackPhotos && order.feedbackPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {order.feedbackPhotos.map((id) => {
                const card = getCardById(id);
                if (!card) return null;
                return (
                  <div key={id} className={`aspect-square rounded-md flex flex-col items-center justify-center gap-1 ${card.bg}`}>
                    <span className="text-2xl">{card.emoji}</span>
                    <span className="text-[11px] font-medium">{card.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {order.userRating && (
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={`text-sm ${s <= order.userRating! ? "text-yellow-400" : "text-muted-foreground/30"}`}>★</span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
