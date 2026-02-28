# 技术架构 - 上门喂猫 MVP

## 🏗️ 系统架构
采用 **单体全栈架构 (Monolithic Full-stack)**，利用 Next.js 的 Server Components 和 Server Actions 实现前后端一体化，减少部署复杂度，适合 MVP 快速迭代。

### 技术栈 (Tech Stack)
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons
- **Backend**: Next.js Server Actions (API Routes if needed)
- **Database**: Supabase (PostgreSQL) + Prisma ORM (可选) / Mock Data (MVP 极速开发)
- **Auth**: NextAuth.js / Supabase Auth
- **Deployment**: Vercel

## 📂 目录结构
```bash
src/
├── app/                 # Next.js App Router
│   ├── (auth)/          # 登录注册路由组
│   ├── (dashboard)/     # 控制台路由组
│   │   ├── user/        # 铲屎官界面
│   │   │   ├── history/ # 历史订单
│   │   │   └── diary/   # 猫咪日记
│   │   └── feeder/      # 喂猫员界面
│   ├── api/             # API Endpoints (如需)
│   └── layout.tsx       # 全局布局
├── components/          # 组件库
│   ├── ui/              # 基础 UI 组件 (Button, Input, Card)
│   └── features/        # 业务组件 (OrderCard, FeederProfile)
├── lib/                 # 工具函数与配置
│   ├── utils.ts         # 通用工具
│   ├── cat-photo-cards.ts # 猫咪状态卡片数据
│   ├── distance.ts      # Haversine 距离计算
│   └── db.ts            # 数据库连接
├── types/               # TypeScript 类型定义
└── services/            # 数据服务层 (Mock or DB calls)