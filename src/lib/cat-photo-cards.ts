/** 猫咪状态卡片 — 用 emoji + 彩色背景模拟照片 */

export interface CatPhotoCard {
  id: string;
  emoji: string;
  label: string;
  bg: string; // Tailwind bg class
}

export const CAT_PHOTO_CARDS: CatPhotoCard[] = [
  { id: "eating", emoji: "😋", label: "正在吃饭", bg: "bg-orange-100" },
  { id: "sleeping", emoji: "😴", label: "呼呼大睡", bg: "bg-blue-100" },
  { id: "playing", emoji: "🧶", label: "开心玩耍", bg: "bg-pink-100" },
  { id: "grooming", emoji: "✨", label: "梳毛打理", bg: "bg-purple-100" },
  { id: "drinking", emoji: "💧", label: "喝水补水", bg: "bg-cyan-100" },
  { id: "litter", emoji: "🧹", label: "铲屎完毕", bg: "bg-green-100" },
  { id: "cuddling", emoji: "🥰", label: "撸猫互动", bg: "bg-rose-100" },
  { id: "exploring", emoji: "🐾", label: "四处巡逻", bg: "bg-amber-100" },
  { id: "relaxing", emoji: "☀️", label: "悠闲晒太阳", bg: "bg-yellow-100" },
];

export function getCardById(id: string): CatPhotoCard | undefined {
  return CAT_PHOTO_CARDS.find((c) => c.id === id);
}
