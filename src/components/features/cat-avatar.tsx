import { Cat } from "lucide-react";

// 根据猫咪数量分配不同的背景色，增加视觉区分度
const AVATAR_COLORS = [
  "bg-orange-100 text-orange-600",
  "bg-blue-100 text-blue-600",
  "bg-pink-100 text-pink-600",
  "bg-purple-100 text-purple-600",
  "bg-teal-100 text-teal-600",
];

interface CatAvatarProps {
  catCount: number;
  size?: "sm" | "md";
}

export function CatAvatar({ catCount, size = "md" }: CatAvatarProps) {
  const sizeClass = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const colorIndex = (catCount - 1) % AVATAR_COLORS.length;

  return (
    <div className={`relative ${sizeClass} rounded-full ${AVATAR_COLORS[colorIndex]} flex items-center justify-center shrink-0`}>
      <Cat className={iconSize} />
      {catCount > 1 && (
        <span className="absolute -bottom-0.5 -right-0.5 bg-foreground text-background text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
          {catCount}
        </span>
      )}
    </div>
  );
}
