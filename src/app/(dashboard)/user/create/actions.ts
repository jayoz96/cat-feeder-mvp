"use server";

import { CreateOrderInput } from "@/types";
import { OrderService } from "@/services/order-service";

export interface ActionResult {
  success: boolean;
  message: string;
  orderId?: string;
}

export async function submitOrder(input: CreateOrderInput): Promise<ActionResult> {
  // 服务端校验
  if (input.catCount < 1 || input.catCount > 10) {
    return { success: false, message: "猫咪数量需在 1-10 只之间" };
  }

  if (!input.startDate || !input.endDate) {
    return { success: false, message: "请选择服务日期" };
  }

  if (new Date(input.startDate) > new Date(input.endDate)) {
    return { success: false, message: "结束日期不能早于开始日期" };
  }

  if (!input.address.trim()) {
    return { success: false, message: "请填写服务地址" };
  }

  try {
    // MVP 阶段使用固定用户 ID
    const order = OrderService.createOrder(input, "user-1");
    return {
      success: true,
      message: "订单发布成功，等待喂猫员接单",
      orderId: order.id,
    };
  } catch {
    return { success: false, message: "发布失败，请稍后重试" };
  }
}
