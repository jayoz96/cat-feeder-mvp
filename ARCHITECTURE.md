# 技术架构 - 上门喂猫 MVP

## 🏗️ 系统架构
采用 **单体全栈架构 (Monolithic Full-stack)**，利用 Next.js 的 Server Components 和 Server Actions 实现前后端一体化，减少部署复杂度，适合 MVP 快速迭代。

### 技术栈 (Tech Stack)
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui, Lucide Icons
- **Backend**: Next.js Server Actions
- **数据持久化**: 内存 Mock 数据 (globalThis 持久化)，支持热重载版本检测刷新
- **地址服务**: 高德 Web 服务 API + 本地地址库降级
- **Deployment**: Vercel

### 核心设计决策
- **无数据库依赖**：MVP 阶段使用 `globalThis` 内存存储 + 50 条 Mock 数据，避免引入数据库配置的复杂度
- **Server Actions 替代 API Routes**：所有数据操作通过 Server Actions 完成，减少样板代码
- **懒检查代替定时器**：超时自动完结订单通过 `autoCompleteExpired()` 在每次查询时触发，零额外基础设施
- **URL 驱动状态**：分页、排序、表单预填均通过 URL search params 实现，无额外状态管理库

### 订单状态机
```
待接单 → 已接单 → 服务中 → 待审核 → 已支付
(pending) (accepted) (in_progress) (pending_review) (paid)
```

## 📂 目录结构
```bash
src/
├── app/                       # Next.js App Router
│   ├── (dashboard)/           # 控制台路由组
│   │   ├── layout.tsx         # 双端布局（角色切换导航）
│   │   ├── user/              # 猫主人端
│   │   │   ├── page.tsx       # 我的订单（进行中）
│   │   │   ├── create/        # 发布需求（支持再来一单预填）
│   │   │   ├── history/       # 历史订单
│   │   │   ├── cats/          # 猫咪档案管理
│   │   │   └── diary/         # 猫咪日记
│   │   └── feeder/            # 喂猫员端
│   │       ├── page.tsx       # 接单大厅（分页 + 距离/时间排序）
│   │       ├── [id]/          # 订单详情（费用明细 + 聊天 + 导航）
│   │       ├── tasks/         # 我的任务（进行中/待审核/历史）
│   │       └── profile/       # 个人主页（评分 + 评价列表）
│   ├── page.tsx               # 首页（角色选择入口）
│   └── layout.tsx             # 全局布局
├── components/
│   ├── ui/                    # shadcn 基础组件 (Button, Card, Dialog, Input)
│   └── features/              # 业务组件
│       ├── address-picker.tsx # 高德地址搜索 + 本地降级
│       ├── cat-avatar.tsx     # 猫咪头像（品种颜色区分）
│       ├── chat-window.tsx    # 模拟聊天窗口
│       ├── nav-button.tsx     # 跳转高德/百度地图导航
│       └── pagination.tsx     # 通用分页组件
├── lib/
│   ├── utils.ts               # 通用工具（cn 函数等）
│   ├── cat-photo-cards.ts     # 9 张猫咪状态卡片数据
│   └── distance.ts            # Haversine 距离计算 + 格式化
├── services/
│   ├── order-service.ts       # 订单 CRUD + 状态流转 + 距离排序 + 自动完结
│   ├── cat-service.ts         # 猫咪档案 CRUD
│   ├── review-service.ts      # 评价系统
│   └── mock-data.ts           # 50 条模拟数据（含南京江宁区真实坐标）
└── types/
    └── index.ts               # Order, Cat, Review, CheckIn 等类型定义