# CLAUDE.md - Agentic Coding 协作协议与项目规范

> **项目目标**: 为 Agentic Coding 比赛构建一个"上门喂猫"的 MVP 产品。
> **你的角色**: 高级全栈工程师 & 产品负责人 (Senior Full-Stack Engineer & Product Owner)

## 🛠️ 构建与运行命令 (Build & Run)
- `npm run dev`      - 启动开发服务器 (默认端口 3000)
- `npm run build`    - 构建生产版本（**最终质量门禁**，比 tsc 更严格）
- `npm run lint`     - 运行 ESLint 检查代码质量
- `npx tsc --noEmit`  - TypeScript 类型检查（**每次改动后必须运行**）
- `npx shadcn-ui@latest add [组件名]` - 添加 Shadcn UI 组件

## 🏗️ 架构与技术栈 (Architecture & Tech Stack)
- **框架**: Next.js 16 (App Router, Server Actions)
- **样式**: Tailwind CSS 4 + Shadcn UI (Radix Primitives)
- **语言**: TypeScript (启用严格模式)
- **数据持久化**: 内存 Mock 数据 (globalThis 持久化，50 条模拟订单)
- **地址服务**: 高德 Web 服务 API + 本地地址库降级
- **图标库**: Lucide React

## 📱 核心业务流程

### 订单状态机
```
待接单 → 已接单 → 服务中 → 待审核 → 已支付
(pending) (accepted) (in_progress) (pending_review) (paid)
```

### 用户工作流
```
猫主人：发布需求 → 等待接单 → 查看服务进度 → 审核照片墙 → 评分支付
喂猫员：浏览大厅 → 接单 → 签到 → 拍照反馈 → 签退 → 等待审核收款
```

### 费用计算规则
- 基础价格：`天数 × 50元/天 × 猫咪数量`
- 加急订单：基础价格 × 1.5 倍率
- 超时自动完结：`pending_review` 超过 3 小时自动转为 `paid`（懒检查机制，无需定时器）

## 📝 编码标准与风格指南 (Coding Standards)
- **组件 (Components)**:
  - 使用函数式组件，采用 `PascalCase` 命名。
  - 通用组件放在 `src/components/ui`，业务组件放在 `src/components/features`。
  - 页面专属组件放在页面同级目录（如 `user/review-dialog.tsx`）。
  - 页面使用 `export default`，组件使用具名导出 `export const`。
- **Props**:
  - 为 Props 定义接口 (例如 `interface ButtonProps`)。
  - 在函数参数中解构 Props。
- **Hooks**:
  - 在 `src/hooks` 中创建自定义 Hook 以复用逻辑。
  - Hook 名称必须以 `use` 开头。
- **命名规范**:
  - 变量/函数: `camelCase` (小驼峰)
  - 文件名: `kebab-case` (例如 `user-profile.tsx`, `order-service.ts`)
  - 常量: `UPPER_SNAKE_CASE` (大写下划线)
- **错误处理**:
  - Server Action 统一返回 `ActionResult { success, message }` 结构。
  - 异步函数中使用 `try/catch` 块，`catch` 中返回用户友好提示，不暴露内部错误。
  - 外部 API 调用失败时静默降级（如地址搜索降级到本地库），不向前端抛错。
- **注释**:
  - 为复杂逻辑编写 JSDoc。
  - 解释 *为什么* 这样做，而不仅仅是 *做了什么*。
- **多文件改动策略**:
  - 始终按 **类型 → 服务 → Action → UI** 的顺序分层推进。
  - 保证每一层改完后 `tsc --noEmit` 通过，不出现中间的"半成品"状态。

## 🔒 安全规范
- **API Key 保护**：密钥通过环境变量注入（`NEXT_PUBLIC_AMAP_KEY`），`.env.local` 已加入 `.gitignore`。
- **权限校验**：数据操作必须校验 `userId` 归属（如删除订单时验证 `order.userId !== userId`）。
- **状态流转校验**：每个状态变更方法检查当前状态是否合法，防止非法跳转。
- **输入校验**：Server Action 入口校验必填参数，空值直接返回错误。
- **错误隔离**：`catch` 块中只返回通用提示文案，不暴露堆栈或内部逻辑。

## 🛡️ 容错与降级策略
| 场景 | 降级方案 |
|------|---------|
| 高德 API Key 未配置 | 自动使用本地地址库（16 条南京地址） |
| 高德 API 请求失败 | `catch` 静默降级到本地模糊搜索 |
| `pending_review` 超时 | 懒检查自动转 `paid`，无需 cron |
| Mock 数据变更后缓存不刷新 | 版本号机制检测变更并重新初始化 |
| `useSearchParams` 无 Suspense | 页面拆为 wrapper + inner，wrapper 包裹 Suspense |

## 🤖 Agent 协作规则 (团队模式)
1. **思考先行 (Think Before Coding)**:
   - 编写代码前，先分析 `REQUIREMENTS.md` 中的需求。
   - 将复杂任务拆解为更小的、可验证的步骤。
   - 跨层功能使用 **Plan Mode** 先产出方案文档再动手。
2. **上下文感知 (Context Awareness)**:
   - 始终检查 `ARCHITECTURE.md` 以确保设计一致性。
   - 完成主要任务后更新 `PROGRESS.md`。
   - 新增文件时根据本文档的目录结构放到正确位置。
3. **质量保证 (Quality Assurance)**:
   - 每次改动后运行 `tsc --noEmit` 检查类型错误。
   - 功能完成后运行 `npm run build` 作为最终门禁。
   - 确保没有阻塞性 Bug 后再标记任务为"已完成"。
4. **沟通 (Communication)**:
   - 如果需求模棱两可，主动提出澄清问题。
   - 清晰、简洁地总结变更内容。
5. **最小侵入原则 (Minimal Invasion)**:
   - 优先选择最小改动量的方案，不引入不必要的依赖。
   - Bug 修复只改必要的代码，不顺带"改善"周围代码。

## 📦 项目目录结构
```text
src/
├── app/                            # Next.js App Router
│   ├── (dashboard)/                # 控制台路由组
│   │   ├── layout.tsx              # 双端布局（角色切换导航）
│   │   ├── user/                   # 猫主人端
│   │   │   ├── page.tsx            # 我的订单（进行中）
│   │   │   ├── actions.ts          # Server Actions (删除、审核支付)
│   │   │   ├── user-order-card.tsx # 订单卡片（含删除、查看详情）
│   │   │   ├── review-dialog.tsx   # 审核支付弹窗
│   │   │   ├── pending-review-alert.tsx  # 待审核弹窗提醒
│   │   │   ├── order-detail-dialog.tsx   # 订单详情弹窗
│   │   │   ├── create/             # 发布需求（支持再来一单预填）
│   │   │   ├── history/            # 历史订单
│   │   │   ├── cats/               # 猫咪档案管理
│   │   │   └── diary/              # 猫咪日记
│   │   └── feeder/                 # 喂猫员端
│   │       ├── page.tsx            # 接单大厅（分页 + 排序）
│   │       ├── actions.ts          # Server Actions (接单)
│   │       ├── pending-order-card.tsx  # 待接订单卡片（AI推荐标签）
│   │       ├── sort-toggle.tsx     # 距离/时间排序切换
│   │       ├── [id]/               # 订单详情（费用明细+聊天+导航）
│   │       ├── tasks/              # 我的任务（含完成服务弹窗）
│   │       └── profile/            # 个人主页（评分+评价列表）
│   ├── page.tsx                    # 首页（角色选择入口）
│   └── layout.tsx                  # 全局布局
├── components/
│   ├── ui/                         # shadcn 基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── sonner.tsx
│   └── features/                   # 业务组件
│       ├── address-picker.tsx      # 高德地址搜索 + 本地降级
│       ├── cat-avatar.tsx          # 猫咪头像（品种颜色区分）
│       ├── chat-window.tsx         # 模拟聊天窗口
│       ├── nav-button.tsx          # 跳转高德/百度地图导航
│       └── pagination.tsx          # 通用分页组件（3 个页面复用）
├── lib/
│   ├── utils.ts                    # 通用工具（cn 函数等）
│   ├── cat-photo-cards.ts          # 9 张猫咪状态卡片数据 + getCardById
│   └── distance.ts                 # Haversine 距离计算 + 格式化显示
├── services/
│   ├── order-service.ts            # 订单 CRUD + 状态流转 + 距离排序 + 自动完结
│   ├── cat-service.ts              # 猫咪档案 CRUD
│   ├── review-service.ts           # 评价系统
│   └── mock-data.ts                # 50 条模拟数据（含南京江宁区真实坐标）
└── types/
    └── index.ts                    # Order, Cat, Review, CheckIn, Coordinates 等类型
```

### 关键组件职责

| 组件/服务 | 职责 |
|-----------|------|
| `order-service.ts` | 订单全生命周期：创建、接单、开始、完成、审核支付、删除、距离排序、超时自动完结 |
| `mock-data.ts` | 50 条多样化数据（20 pending / 3 accepted / 3 in_progress / 4 pending_review / 20 paid），含真实坐标 |
| `address-picker.tsx` | 高德 API 联想搜索，300ms 防抖，失败静默降级本地库 |
| `pagination.tsx` | 通用分页，接受 `total/pageSize/basePath`，基于 URL searchParams |
| `distance.ts` | Haversine 公式计算球面距离，<1km 显示米，≥1km 显示公里 |
| `cat-photo-cards.ts` | 9 张 emoji 猫咪状态卡片（吃饭/睡觉/玩耍/梳毛等），替代图片上传 |
| `pending-review-alert.tsx` | 进入页面自动检测待审核订单并弹窗提醒 |
| `sort-toggle.tsx` | 客户端排序切换组件，通过 URL query param 传递，切换时回到第一页 |

## 🚀 Git 提交规范 (Commit Convention)
- `feat(scope)`: 新增功能 (例如 `feat(order): add distance sorting`)
- `fix(scope)`: 修复 Bug (例如 `fix(cache): refresh mock data on version change`)
- `docs(scope)`: 文档变更 (例如 `docs: update ARCHITECTURE.md`)
- `style(scope)`: 代码格式、标点等不影响逻辑的更改
- `refactor(scope)`: 代码重构
- `test(scope)`: 添加缺失的测试
- `chore(scope)`: 构建过程、辅助工具变动
