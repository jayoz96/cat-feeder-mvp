"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cat } from "lucide-react";
import { CatProfile } from "@/types";

const CAT_COLORS = ["bg-orange-100 text-orange-600", "bg-blue-100 text-blue-600", "bg-pink-100 text-pink-600", "bg-green-100 text-green-600", "bg-purple-100 text-purple-600"];

export function CatProfileCard({ cat }: { cat: CatProfile }) {
  const colorClass = CAT_COLORS[cat.name.charCodeAt(0) % CAT_COLORS.length];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colorClass}`}>
            <Cat className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">{cat.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{cat.breed} · {cat.age}岁</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-1">
        <p>性格：{cat.personality}</p>
        <p>饮食：{cat.dietNotes}</p>
      </CardContent>
    </Card>
  );
}
