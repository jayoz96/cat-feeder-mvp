"use server";

import { OrderService } from "@/services/order-service";

export interface ActionResult {
  success: boolean;
  message: string;
}

export async function acceptOrder(orderId: string): Promise<ActionResult> {
  if (!orderId) {
    return { success: false, message: "订单ID无效" };
  }

  const order = OrderService.acceptOrder(orderId, "feeder-1");
  if (!order) {
    return { success: false, message: "接单失败，订单可能已被接走" };
  }

  return { success: true, message: "接单成功！请前往「我的任务」查看" };
}
