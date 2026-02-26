"use server";

import { OrderService } from "@/services/order-service";

export interface ActionResult {
  success: boolean;
  message: string;
}

export async function startTask(orderId: string): Promise<ActionResult> {
  if (!orderId) {
    return { success: false, message: "订单ID无效" };
  }

  const order = OrderService.startOrder(orderId);
  if (!order) {
    return { success: false, message: "操作失败，请确认订单状态" };
  }

  // 记录到达打卡
  OrderService.addCheckIn(orderId, "feeder-1", "arrive", "已到达，开始服务");

  return { success: true, message: "已签到，开始服务！" };
}

export async function completeTask(
  orderId: string,
  feedbackNote: string,
  photoCardIds?: string[]
): Promise<ActionResult> {
  if (!orderId) {
    return { success: false, message: "订单ID无效" };
  }

  if (!feedbackNote.trim()) {
    return { success: false, message: "请填写服务反馈" };
  }

  // 记录离开打卡
  OrderService.addCheckIn(orderId, "feeder-1", "leave", feedbackNote);

  const order = OrderService.completeOrder(orderId, {
    note: feedbackNote,
    photos: photoCardIds && photoCardIds.length > 0 ? photoCardIds : [],
  });

  if (!order) {
    return { success: false, message: "操作失败，请确认订单状态" };
  }

  return { success: true, message: "服务已完成，感谢您的付出！" };
}
