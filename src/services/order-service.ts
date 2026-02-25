import { Order, CreateOrderInput } from "@/types";
import { MOCK_ORDERS } from "./mock-data";

// 内存中的订单存储（MVP 用，重启会丢失）
let orders: Order[] = [...MOCK_ORDERS];

const PRICE_PER_DAY = 50;

export const OrderService = {
  getOrders(): Order[] {
    return orders;
  },

  getOrdersByUser(userId: string): Order[] {
    return orders.filter((o) => o.userId === userId);
  },

  getOrdersByStatus(status: Order["status"]): Order[] {
    return orders.filter((o) => o.status === status);
  },

  getPendingOrders(): Order[] {
    return orders.filter((o) => o.status === "pending");
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

    orders = [order, ...orders];
    return order;
  },

  acceptOrder(orderId: string, feederId: string): Order | null {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status !== "pending") return null;

    order.status = "accepted";
    order.feederId = feederId;
    order.acceptedAt = new Date().toISOString();
    return order;
  },

  startOrder(orderId: string): Order | null {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status !== "accepted") return null;

    order.status = "in_progress";
    return order;
  },

  completeOrder(
    orderId: string,
    feedback?: { note: string; photos: string[] }
  ): Order | null {
    const order = orders.find((o) => o.id === orderId);
    if (!order || (order.status !== "accepted" && order.status !== "in_progress")) return null;

    order.status = "completed";
    order.completedAt = new Date().toISOString();
    if (feedback) {
      order.feedbackNote = feedback.note;
      order.feedbackPhotos = feedback.photos;
    }
    return order;
  },
};
