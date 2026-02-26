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
  DialogFooter,
} from "@/components/ui/dialog";
import { CAT_PHOTO_CARDS, CatPhotoCard } from "@/lib/cat-photo-cards";
import { completeTask } from "./actions";

export function CompleteDialog({
  open,
  onOpenChange,
  orderId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function toggleCard(id: string) {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 6 ? [...prev, id] : prev
    );
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const result = await completeTask(orderId, note, selectedCards);
      if (result.success) {
        toast.success(result.message);
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
          <DialogTitle>完成服务反馈</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* 猫咪状态卡片选择器 */}
          <div>
            <label className="text-sm font-medium">
              选择猫咪状态（最多6张，已选 {selectedCards.length}）
            </label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {CAT_PHOTO_CARDS.map((card) => {
                const selected = selectedCards.includes(card.id);
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => toggleCard(card.id)}
                    className={`aspect-square rounded-md flex flex-col items-center justify-center gap-1 transition-all ${card.bg} ${
                      selected
                        ? "ring-2 ring-primary ring-offset-1 scale-95"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <span className="text-2xl">{card.emoji}</span>
                    <span className="text-xs font-medium">{card.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 文本反馈 */}
          <div>
            <label className="text-sm font-medium">服务反馈</label>
            <textarea
              className="mt-1.5 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="请描述喂食情况、猫咪状态等"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "提交中..." : "确认完成"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
