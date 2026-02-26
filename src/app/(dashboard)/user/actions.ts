"use server";

import { OrderService } from "@/services/order-service";
import { ReviewService } from "@/services/review-service";

export interface ActionResult {
  success: boolean;
  message: string;
}

export async function deleteOrder(orderId: string): Promise<ActionResult> {
  if (!orderId) {
    return { success: false, message: "订单 ID 不能为空" };
  }

  try {
    const deleted = OrderService.deleteOrder(orderId, "user-1");
    if (!deleted) {
      return { success: false, message: "订单不存在或无法删除" };
    }
    return { success: true, message: "订单已删除" };
  } catch {
    return { success: false, message: "删除失败，请稍后重试" };
  }
}

export async function reviewAndPay(
  orderId: string,
  rating?: number,
  comment?: string
): Promise<ActionResult> {
  if (!orderId) {
    return { success: false, message: "订单 ID 不能为空" };
  }

  try {
    const order = OrderService.reviewAndPay(orderId, rating, comment);
    if (!order) {
      return { success: false, message: "订单不存在或状态不正确" };
    }

    // 创建评价记录
    if (rating && order.feederId) {
      ReviewService.create({
        orderId,
        fromUserId: order.userId,
        toUserId: order.feederId,
        rating,
        comment: comment || "",
      });
    }

    return { success: true, message: "支付成功，订单已完结" };
  } catch {
    return { success: false, message: "操作失败，请稍后重试" };
  }
}
