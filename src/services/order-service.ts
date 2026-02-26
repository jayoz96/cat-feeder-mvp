import { Order, CreateOrderInput } from "@/types";
import { MOCK_ORDERS } from "./mock-data";

// 使用 globalThis 确保开发模式下模块重载时数据不丢失
const globalForOrders = globalThis as unknown as {
  __orders?: Order[];
};

if (!globalForOrders.__orders) {
  globalForOrders.__orders = [...MOCK_ORDERS];
}

function getStore(): Order[] {
  return globalForOrders.__orders!;
}

function setStore(orders: Order[]) {
  globalForOrders.__orders = orders;
}

const PRICE_PER_DAY = 50;
const AUTO_COMPLETE_MS = 3 * 60 * 60 * 1000; // 3 小时

/** 懒检查：pending_review 超过 3 小时自动转 paid */
function autoCompleteExpired() {
  const now = Date.now();
  for (const order of getStore()) {
    if (
      order.status === "pending_review" &&
      order.completedAt &&
      now - new Date(order.completedAt).getTime() >= AUTO_COMPLETE_MS
    ) {
      order.status = "paid";
    }
  }
}

export const OrderService = {
  getOrders(): Order[] {
    autoCompleteExpired();
    return getStore();
  },

  getOrdersByUser(userId: string): Order[] {
    autoCompleteExpired();
    return getStore().filter((o) => o.userId === userId);
  },

  getOrdersByStatus(status: Order["status"]): Order[] {
    autoCompleteExpired();
    return getStore().filter((o) => o.status === status);
  },

  getPendingOrders(): Order[] {
    autoCompleteExpired();
    return getStore().filter((o) => o.status === "pending");
  },

  createOrder(input: CreateOrderInput, userId: string): Order {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const order: Order = {
      id: `order-${Date.now()}`,
      userId,
      status: "pending",
      catCount: input.catCount,
      startDate: input.startDate,
      endDate: input.endDate,
      notes: input.notes,
      address: input.address,
      pricePerDay: PRICE_PER_DAY,
      totalPrice: days * PRICE_PER_DAY * input.catCount,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setStore([order, ...getStore()]);
    return order;
  },

  acceptOrder(orderId: string, feederId: string): Order | null {
    const order = getStore().find((o) => o.id === orderId);
    if (!order || order.status !== "pending") return null;

    order.status = "accepted";
    order.feederId = feederId;
    order.acceptedAt = new Date().toISOString();
    return order;
  },

  startOrder(orderId: string): Order | null {
    const order = getStore().find((o) => o.id === orderId);
    if (!order || order.status !== "accepted") return null;

    order.status = "in_progress";
    return order;
  },

  completeOrder(
    orderId: string,
    feedback?: { note: string; photos: string[] }
  ): Order | null {
    const order = getStore().find((o) => o.id === orderId);
    if (!order || (order.status !== "accepted" && order.status !== "in_progress")) return null;

    order.status = "pending_review";
    order.completedAt = new Date().toISOString();
    if (feedback) {
      order.feedbackNote = feedback.note;
      order.feedbackPhotos = feedback.photos;
    }
    return order;
  },

  reviewAndPay(orderId: string): Order | null {
    const order = getStore().find((o) => o.id === orderId);
    if (!order || order.status !== "pending_review") return null;

    order.status = "paid";
    return order;
  },
};
