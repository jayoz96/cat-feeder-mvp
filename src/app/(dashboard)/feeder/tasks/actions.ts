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

  return { success: true, message: "已签到，开始服务！" };
}

export async function completeTask(
  orderId: string,
  feedbackNote: string
): Promise<ActionResult> {
  if (!orderId) {
    return { success: false, message: "订单ID无效" };
  }

  if (!feedbackNote.trim()) {
    return { success: false, message: "请填写服务反馈" };
  }

  const order = OrderService.completeOrder(orderId, {
    note: feedbackNote,
    photos: ["mock-photo-1.jpg", "mock-photo-2.jpg"],
  });

  if (!order) {
    return { success: false, message: "操作失败，请确认订单状态" };
  }

  return { success: true, message: "服务已完成，感谢您的付出！" };
}
