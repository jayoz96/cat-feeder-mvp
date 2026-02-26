"use server";

import { OrderService } from "@/services/order-service";

export interface ActionResult {
  success: boolean;
  message: string;
}

export async function reviewAndPay(orderId: string): Promise<ActionResult> {
  if (!orderId) {
    return { success: false, message: "订单 ID 不能为空" };
  }

  try {
    const order = OrderService.reviewAndPay(orderId);
    if (!order) {
      return { success: false, message: "订单不存在或状态不正确" };
    }
    return { success: true, message: "支付成功，订单已完结" };
  } catch {
    return { success: false, message: "操作失败，请稍后重试" };
  }
}
