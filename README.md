# 🐱 上门喂猫 MVP

一个连接猫主人和喂猫员的上门喂猫服务平台。猫主人出差或旅行时，可以发布喂猫需求，由附近的喂猫员接单上门服务。

## 技术栈

- **框架**：Next.js 16 (App Router, Server Actions)
- **语言**：TypeScript (严格模式)
- **样式**：Tailwind CSS + shadcn/ui
- **图标**：Lucide React
- **数据**：内存 Mock 数据 (globalThis 持久化)
- **地址搜索**：高德 Web 服务 API + 本地地址库降级

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

浏览器打开 [http://localhost:3000](http://localhost:3000) 即可访问。

### 环境变量（可选）

在项目根目录创建 `.env.local`：

```
NEXT_PUBLIC_AMAP_KEY=你的高德API密钥
```

不配置时地址搜索会使用本地地址库。

## 功能概览

### 猫主人端 (`/user`)

| 功能 | 说明 |
|------|------|
| 订单管理 | 查看进行中订单及实时状态流转 |
| 历史订单 | 独立页面查看已支付订单，支持查看完整详情 |
| 发布需求 | 选择猫咪数量、日期、地址、备注，实时费用预估 |
| 地址搜索 | 高德 API 关键词联想 + 本地地址库降级 |
| 常用地址 | 历史地址标签一键填入 |
| 紧急订单 | 开关切换，自动 1.5 倍加价 |
| 审核支付 | 查看照片墙和服务反馈、星级评分、模拟支付宝/微信支付 |
| 待审核提醒 | 进入订单页自动弹窗提醒有待审核订单 |
| 自动完结 | 3 小时未审核自动完成订单 |
| 猫咪档案 | 查看/添加猫咪信息（品种、性格、饮食备注） |
| 删除订单 | 所有状态的订单均可删除 |

### 喂猫员端 (`/feeder`)

| 功能 | 说明 |
|------|------|
| 接单大厅 | 浏览待接订单，支持分页（每页 5 条） |
| 距离排序 | 基于 Haversine 公式按距离近→远排序，显示"距你 X.Xkm" |
| 排序切换 | 支持按距离/按时间两种排序方式自由切换 |
| AI 推荐 | 猫多/价高/日期近的订单自动标记推荐 |
| 加急标识 | 橙色徽章突出显示紧急订单 |
| 订单详情 | 完整信息 + 费用明细 + 聊天窗口 |
| 一键导航 | 跳转高德/百度地图导航 |
| 任务管理 | 进行中 / 待审核 / 历史订单三栏展示 |
| 照片墙 | 完成服务时选择 emoji 猫咪状态卡片（最多 6 张） |
| 服务打卡 | 签到签退自动记录，时间线展示 |
| 个人主页 | 评分统计、完成订单数、服务评价列表 |

### 订单状态机

```
待接单 → 已接单 → 服务中 → 待审核 → 已支付
(pending) (accepted) (in_progress) (pending_review) (paid)
```

## 项目结构

```
src/
├── app/(dashboard)/
│   ├── feeder/            # 喂猫员端页面
│   │   ├── [id]/          # 订单详情页
│   │   ├── profile/       # 个人主页
│   │   ├── tasks/         # 我的任务
│   │   └── sort-toggle    # 排序切换组件
│   └── user/              # 猫主人端页面
│       ├── cats/          # 猫咪档案管理
│       ├── create/        # 发布需求
│       └── history/       # 历史订单
├── components/
│   ├── ui/                # shadcn 基础组件
│   └── features/          # 业务组件（地址选择、分页、聊天等）
├── lib/
│   ├── cat-photo-cards.ts # 猫咪状态卡片数据
│   └── distance.ts        # Haversine 距离计算
├── services/              # 数据服务层
│   ├── order-service.ts   # 订单 CRUD + 状态流转 + 距离排序
│   ├── cat-service.ts     # 猫咪档案
│   ├── review-service.ts  # 评价系统
│   └── mock-data.ts       # 50 条模拟数据（含坐标）
└── types/                 # TypeScript 类型定义
```

## 开发命令

```bash
npm run dev       # 启动开发服务器
npm run build     # 构建生产版本
npm run lint      # ESLint 代码检查
npx tsc --noEmit  # TypeScript 类型检查
```
