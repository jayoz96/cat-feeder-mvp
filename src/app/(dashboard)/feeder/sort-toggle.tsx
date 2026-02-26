"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownUp, Clock, MapPin } from "lucide-react";

export function SortToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") === "time" ? "time" : "distance";

  function handleToggle(mode: "distance" | "time") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", mode);
    params.delete("page"); // 切换排序时回到第一页
    router.push(`/feeder?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      <button
        onClick={() => handleToggle("distance")}
        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
          current === "distance"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <MapPin className="h-3 w-3" />
        按距离
      </button>
      <button
        onClick={() => handleToggle("time")}
        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
          current === "time"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Clock className="h-3 w-3" />
        按时间
      </button>
    </div>
  );
}
