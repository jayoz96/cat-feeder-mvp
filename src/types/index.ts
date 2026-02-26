// 用户角色枚举
export type UserRole = "user" | "feeder";

// 订单状态枚举 - MVP 核心状态机
// pending → accepted → in_progress → pending_review → paid
export type OrderStatus = "pending" | "accepted" | "in_progress" | "completed" | "pending_review" | "paid";

// 用户类型
export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  address?: string;
  avatar?: string;
  rating: number;
  createdAt: string;
}

// 订单类型
export interface Order {
  id: string;
  userId: string;
  feederId?: string;
  status: OrderStatus;
  // 喂猫详情
  catCount: number;
  startDate: string;
  endDate: string;
  notes: string;
  address: string;
  // 费用
  pricePerDay: number;
  totalPrice: number;
  // 反馈
  feedbackPhotos?: string[];
  feedbackNote?: string;
  // 评价
  userRating?: number;
  feederRating?: number;
  // 时间戳
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

// 创建订单的表单数据
export interface CreateOrderInput {
  catCount: number;
  startDate: string;
  endDate: string;
  notes: string;
  address: string;
}
