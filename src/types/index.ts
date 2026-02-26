// 坐标
export interface Coordinates {
  lat: number;
  lng: number;
}

// 用户角色枚举
export type UserRole = "user" | "feeder";

// 订单状态枚举 - MVP 核心状态机
// pending → accepted → in_progress → pending_review → paid
export type OrderStatus = "pending" | "accepted" | "in_progress" | "completed" | "pending_review" | "paid";

// 猫咪档案
export interface CatProfile {
  id: string;
  ownerId: string;
  name: string;
  breed: string;
  age: number;
  personality: string;
  dietNotes: string;
  photo?: string;
}

// 用户类型
export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  address?: string;
  avatar?: string;
  rating: number;
  totalOrders?: number;
  bio?: string;
  serviceArea?: string;
  savedAddresses?: string[];
  location?: Coordinates;
  createdAt: string;
}

// 订单评价
export interface Review {
  id: string;
  orderId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// 服务打卡记录
export interface CheckIn {
  id: string;
  orderId: string;
  feederId: string;
  type: "arrive" | "leave";
  photo?: string;
  note?: string;
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
  catIds?: string[];
  startDate: string;
  endDate: string;
  notes: string;
  address: string;
  location?: Coordinates;
  urgent?: boolean;
  // 费用
  pricePerDay: number;
  totalPrice: number;
  // 反馈
  feedbackPhotos?: string[];
  feedbackNote?: string;
  // 打卡
  checkIns?: CheckIn[];
  // 评价
  userRating?: number;
  feederRating?: number;
  reviewComment?: string;
  // 时间戳
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

// 创建订单的表单数据
export interface CreateOrderInput {
  catCount: number;
  catIds?: string[];
  startDate: string;
  endDate: string;
  notes: string;
  address: string;
  urgent?: boolean;
}
