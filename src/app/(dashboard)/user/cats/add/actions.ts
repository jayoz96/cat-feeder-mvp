"use server";

import { CatService } from "@/services/cat-service";

export async function addCat(input: {
  name: string;
  breed: string;
  age: number;
  personality: string;
  dietNotes: string;
}) {
  if (!input.name.trim() || !input.breed.trim()) {
    return { success: false, message: "请填写猫咪名字和品种" };
  }

  CatService.create({
    ownerId: "user-1",
    name: input.name,
    breed: input.breed,
    age: input.age,
    personality: input.personality || "暂无描述",
    dietNotes: input.dietNotes || "暂无备注",
  });

  return { success: true, message: "添加成功" };
}
