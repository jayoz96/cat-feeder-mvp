import { Order, User } from "@/types";

// Mock 用户数据
export const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "小明",
    phone: "138****1234",
    role: "user",
    address: "北京市朝阳区幸福小区3号楼",
    rating: 4.8,
    createdAt: "2026-01-15",
  },
  {
    id: "feeder-1",
    name: "猫猫侠",
    phone: "139****5678",
    role: "feeder",
    avatar: "",
    rating: 4.9,
    createdAt: "2026-01-10",
  },
];

// Mock 订单数据
export const MOCK_ORDERS: Order[] = [
  {
    id: "order-1",
    userId: "user-1",
    feederId: undefined,
    status: "pending",
    catCount: 2,
    startDate: "2026-03-01",
    endDate: "2026-03-03",
    notes: "两只英短，只喂干粮，每天一次",
    address: "北京市朝阳区幸福小区3号楼",
    pricePerDay: 50,
    totalPrice: 150,
    createdAt: "2026-02-25",
  },
];
