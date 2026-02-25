"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ImagePlus } from "lucide-react";
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
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      const result = await completeTask(orderId, note);
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
          {/* 照片上传占位 */}
          <div>
            <label className="text-sm font-medium">上传照片</label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {["mock-1", "mock-2"].map((id) => (
                <div
                  key={id}
                  className="aspect-square rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground"
                >
                  已上传
                </div>
              ))}
              <button
                type="button"
                className="aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center text-muted-foreground hover:border-muted-foreground/50 transition-colors"
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-xs mt-1">添加</span>
              </button>
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
