import { Order, User, CatProfile, Review, Coordinates } from "@/types";

// 地址对应的坐标（南京江宁区各小区）
const ADDRESS_COORDS: Record<string, Coordinates> = {
  "南京市江宁区东山街道万达广场2栋1403": { lat: 31.9535, lng: 118.8395 },
  "南京市江宁区百家湖花园12栋502": { lat: 31.9340, lng: 118.8280 },
  "南京市江宁区翠屏山小区7栋301": { lat: 31.9420, lng: 118.8150 },
  "南京市江宁区义乌小商品城旁金轮新都汇8栋1201": { lat: 31.9580, lng: 118.8450 },
  "南京市江宁区九龙湖国际企业总部园6栋": { lat: 31.9100, lng: 118.8600 },
  "南京市江宁区天元中路99号武夷绿洲3栋801": { lat: 31.9480, lng: 118.8320 },
  "南京市江宁区将军大道22号翠屏国际城5栋1602": { lat: 31.9380, lng: 118.8100 },
  "南京市江宁区秣陵街道殷巷新寓12栋203": { lat: 31.9200, lng: 118.8500 },
  "南京市江宁区科学园龙眠大道568号同曦鸣城9栋1101": { lat: 31.9150, lng: 118.8350 },
  "南京市江宁区岔路口大街世纪东山花园7栋405": { lat: 31.9560, lng: 118.8420 },
};

// Mock 用户数据
export const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "小明",
    phone: "138****1234",
    role: "user",
    address: "南京市江宁区东山街道万达广场",
    savedAddresses: ["南京市江宁区东山街道万达广场2栋1403", "南京市江宁区义乌小商品城旁金轮新都汇8栋1201"],
    location: { lat: 31.9535, lng: 118.8395 },
    rating: 4.8,
    createdAt: "2026-01-15",
  },
  {
    id: "user-2",
    name: "阿花",
    phone: "136****9012",
    role: "user",
    address: "南京市江宁区百家湖花园",
    savedAddresses: ["南京市江宁区百家湖花园12栋502"],
    location: { lat: 31.9340, lng: 118.8280 },
    rating: 4.6,
    createdAt: "2026-01-20",
  },
  {
    id: "user-3",
    name: "猫奴小王",
    phone: "137****3456",
    role: "user",
    address: "南京市江宁区翠屏山小区",
    savedAddresses: ["南京市江宁区翠屏山小区7栋301"],
    location: { lat: 31.9420, lng: 118.8150 },
    rating: 4.9,
    createdAt: "2026-02-01",
  },
  {
    id: "feeder-1",
    name: "猫猫侠",
    phone: "139****5678",
    role: "feeder",
    avatar: "",
    rating: 4.9,
    totalOrders: 128,
    bio: "资深铲屎官，养猫5年，擅长应对各种性格的猫咪。持有宠物护理证书。",
    serviceArea: "江宁区",
    location: { lat: 31.9450, lng: 118.8300 },
    createdAt: "2026-01-10",
  },
];

// Mock 订单数据 - 生成 50 条
const ADDRESSES = [
  "南京市江宁区东山街道万达广场2栋1403",
  "南京市江宁区百家湖花园12栋502",
  "南京市江宁区翠屏山小区7栋301",
  "南京市江宁区义乌小商品城旁金轮新都汇8栋1201",
  "南京市江宁区九龙湖国际企业总部园6栋",
  "南京市江宁区天元中路99号武夷绿洲3栋801",
  "南京市江宁区将军大道22号翠屏国际城5栋1602",
  "南京市江宁区秣陵街道殷巷新寓12栋203",
  "南京市江宁区科学园龙眠大道568号同曦鸣城9栋1101",
  "南京市江宁区岔路口大街世纪东山花园7栋405",
];

const NOTES_LIST = [
  "英短，只喂干粮，每天一次",
  "布偶猫，需要喂湿粮+铲屎，猫粮在厨房柜子里",
  "橘猫，饭量大，干粮湿粮各一顿，需要陪玩10分钟",
  "美短，比较胆小，进门动作轻一点",
  "暹罗猫，每天喂两次，早晚各一次",
  "加菲猫，需要擦眼睛，猫粮在客厅柜子上",
  "蓝猫，喜欢喝流动水，记得开饮水机",
  "狸花猫，很亲人，喜欢被撸，干粮放阳台",
  "金渐层，肠胃敏感，只能吃指定猫粮（冰箱里）",
  "银渐层，需要铲屎+换水，猫砂在卫生间",
  "缅因猫，体型大食量大，每顿100g干粮",
  "无毛猫，注意保暖，需要穿衣服，衣服在沙发上",
  "折耳猫，关节不好，不要让它跳高处",
  "奶牛猫，精力旺盛，需要用逗猫棒陪玩15分钟",
  "三花猫，比较高冷，喂完粮就可以走",
];

const USER_IDS = ["user-1", "user-2", "user-3"];
const STATUSES: Order["status"][] = ["pending", "accepted", "in_progress", "pending_review", "paid"];

// 预设照片卡片组合，给 pending_review 订单用
const PHOTO_CARD_SETS = [
  ["eating", "drinking", "sleeping"],
  ["eating", "litter", "cuddling", "relaxing"],
  ["playing", "grooming", "eating", "drinking"],
  ["eating", "sleeping", "exploring"],
];

function generateOrders(): Order[] {
  const orders: Order[] = [];
  for (let i = 1; i <= 50; i++) {
    const userId = USER_IDS[i % 3];
    // 前 20 条 pending（接单大厅），中间 10 条进行中，后 20 条已完成
    let status: Order["status"];
    let feederId: string | undefined;
    let acceptedAt: string | undefined;
    let completedAt: string | undefined;
    let feedbackNote: string | undefined;

    if (i <= 20) {
      status = "pending";
    } else if (i <= 23) {
      status = "accepted";
      feederId = "feeder-1";
      acceptedAt = "2026-02-25T10:00:00Z";
    } else if (i <= 26) {
      status = "in_progress";
      feederId = "feeder-1";
      acceptedAt = "2026-02-24T09:00:00Z";
    } else if (i <= 30) {
      status = "pending_review";
      feederId = "feeder-1";
      acceptedAt = "2026-02-23T08:00:00Z";
      completedAt = new Date().toISOString();
      feedbackNote = "猫咪状态良好，已按要求喂食，水也换了新的";
    } else {
      status = "paid";
      feederId = "feeder-1";
      acceptedAt = `2026-02-${String(Math.max(1, 20 - (i - 30))).padStart(2, "0")}T08:00:00Z`;
      completedAt = `2026-02-${String(Math.max(1, 21 - (i - 30))).padStart(2, "0")}T17:00:00Z`;
      feedbackNote = "服务完成，一切正常";
    }

    const catCount = ((i - 1) % 5) + 1;
    const startDay = ((i - 1) % 28) + 1;
    const duration = ((i - 1) % 5) + 1;
    const endDay = Math.min(startDay + duration, 31);
    const days = endDay - startDay + 1;
    const urgent = i % 7 === 0;
    const multiplier = urgent ? 1.5 : 1;
    const totalPrice = Math.round(days * 50 * catCount * multiplier);

    const address = ADDRESSES[(i - 1) % ADDRESSES.length];
    const location = ADDRESS_COORDS[address];

    orders.push({
      id: `order-${i}`,
      userId,
      feederId,
      status,
      catCount,
      startDate: `2026-03-${String(startDay).padStart(2, "0")}`,
      endDate: `2026-03-${String(endDay).padStart(2, "0")}`,
      notes: NOTES_LIST[(i - 1) % NOTES_LIST.length],
      address,
      location,
      urgent: urgent || undefined,
      pricePerDay: 50,
      totalPrice,
      createdAt: `2026-02-${String(Math.max(1, 26 - Math.floor(i / 2))).padStart(2, "0")}`,
      acceptedAt,
      completedAt,
      feedbackNote,
      feedbackPhotos: status === "pending_review" ? PHOTO_CARD_SETS[(i - 27) % PHOTO_CARD_SETS.length] : undefined,
    });
  }
  return orders;
}

export const MOCK_ORDERS: Order[] = generateOrders();

// Mock 猫咪档案
export const MOCK_CATS: CatProfile[] = [
  {
    id: "cat-1",
    ownerId: "user-1",
    name: "大橘",
    breed: "英短",
    age: 3,
    personality: "温顺亲人，喜欢被摸下巴",
    dietNotes: "只吃干粮，每天一次，一次50g",
  },
  {
    id: "cat-2",
    ownerId: "user-1",
    name: "小白",
    breed: "英短",
    age: 2,
    personality: "胆小怕生，进门后会躲起来",
    dietNotes: "干粮为主，偶尔加罐头",
  },
  {
    id: "cat-3",
    ownerId: "user-2",
    name: "布丁",
    breed: "布偶",
    age: 1,
    personality: "粘人，喜欢跟着人走",
    dietNotes: "湿粮+干粮混喂，猫粮在厨房柜子里",
  },
  {
    id: "cat-4",
    ownerId: "user-3",
    name: "橘一",
    breed: "橘猫",
    age: 4,
    personality: "贪吃，饭量大",
    dietNotes: "干粮湿粮各一顿，控制食量",
  },
  {
    id: "cat-5",
    ownerId: "user-3",
    name: "橘二",
    breed: "橘猫",
    age: 3,
    personality: "活泼好动，喜欢逗猫棒",
    dietNotes: "同橘一",
  },
  {
    id: "cat-6",
    ownerId: "user-3",
    name: "橘三",
    breed: "橘猫",
    age: 2,
    personality: "安静，喜欢晒太阳",
    dietNotes: "同橘一",
  },
];
