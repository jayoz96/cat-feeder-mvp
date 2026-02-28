# 上门喂猫 MVP — Claude Code 开发经验总结

> 本文档记录了使用 Claude Code 从零打造"上门喂猫"MVP 的全过程，按开发阶段（Phase）组织，涵盖需求理解、架构设计、编码、Code Review、测试、安全、版本管理等维度的实战经验。

---

## Phase 1：项目初始化 & MVP 核心流程

`9888a9a` → `7a6c83d` | 30 files changed, +7,137 lines

这一阶段从 `create-next-app` 脚手架开始，一次性搭建了完整的 MVP 骨架：类型定义、订单服务层、猫主人端（发布需求/订单列表）、喂猫员端（接单大厅/任务管理/完成反馈）、双端布局和首页导航。

**CLAUDE.md 工程经验（架构设计）**：在写任何业务代码之前，先创建了三个规范文件——`CLAUDE.md`（编码标准与协作协议）、`REQUIREMENTS.md`（需求文档）、`ARCHITECTURE.md`（架构设计）。其中 `CLAUDE.md` 定义了：

- 构建命令置顶（`npm run dev` / `npm run build` / `tsc --noEmit`），确保 Claude Code 每次改动后知道如何验证
- 目录结构约定（`components/ui` vs `components/features` vs `services`），让后续所有新文件自动放到正确位置
- 命名规范（文件 `kebab-case`、组件 `PascalCase`、常量 `UPPER_SNAKE_CASE`），整个项目风格从第一天就统一
- Git 提交规范（`feat/fix/docs` 前缀），保证 commit 历史可读

这相当于给 Claude Code 写了一份"项目宪法"——写一次，整个开发周期持续生效。后续每个 Phase 的文件命名、目录归属、提交格式都自动遵循这份规范，无需反复提醒。

**需求理解**：用户只说了"上门喂猫 MVP"，Claude Code 基于 `REQUIREMENTS.md` 自动拆解出完整的订单状态机（`pending → accepted → in_progress`）、双端角色划分、费用计算逻辑（按天 × 猫数），并用 `globalThis` 做内存持久化避免引入数据库依赖——这是对"MVP 追求速度"这个约束的准确理解。

---

## Phase 2：地址搜索 & 审核支付流程

`b84bbe5` | 12 files changed, +443 lines

**Plan Mode 架构设计**：这是整个项目中唯一使用了 Claude Code Plan Mode 的阶段。在动手写代码之前，先产出了方案文档，明确了：

- 状态机扩展：新增 `pending_review` 和 `paid` 两个状态，完成从服务到支付的闭环
- 文件改动清单：精确到每个文件的职责（`types` 加状态枚举、`order-service` 加 `reviewAndPay` 方法、新建 `review-dialog.tsx`）
- 降级策略：高德 API 不可用时回退到本地地址库

Plan Mode 的价值在于——先对齐方案再动手写代码，避免写到一半发现架构不对要推翻重来。本质上是把"设计评审"内置到了开发流程里。

**安全**：地址搜索中高德 API Key 通过 `NEXT_PUBLIC_AMAP_KEY` 环境变量注入，`.env.local` 被 `.gitignore` 排除，避免密钥泄露到 Git 仓库。同时 `address-picker.tsx` 对 API 调用做了 `try/catch`，失败时静默降级为手动输入，不向前端暴露错误详情。

**编码**：`review-dialog.tsx` 是一个典型的 Claude Code 产出——115 行实现了完整的审核弹窗（喂猫员反馈展示 + 模拟支付宝/微信支付按钮），通过 Server Action 调用 `OrderService.reviewAndPay` 完成状态流转。组件按 `CLAUDE.md` 规范放在页面同级目录，因为它是页面专属业务组件。

---

## Phase 3：稳定性修复

`9a2707b` | Bug fixes

**测试/调试**：这个阶段解决了三个运行时问题：

1. **页面数据不刷新**——Next.js App Router 默认静态渲染，Server Component 在 build 时就固化了数据。修复：所有动态页面加 `export const dynamic = "force-dynamic"` 强制运行时渲染
2. **高德地址搜索跨域**——Web 服务 API 和 JS API 的调用方式不同，调整了请求方式
3. **`pending_review` 超时自动完结**——实现了懒检查机制：每次读取订单时扫描是否有超过 3 小时未审核的订单，自动转为 `paid`

第 3 点的实现很巧妙——不需要定时器或 cron job，利用 `autoCompleteExpired()` 在每个查询方法入口调用，零额外基础设施：

```typescript
function autoCompleteExpired() {
  const now = Date.now();
  for (const order of getStore()) {
    if (order.status === "pending_review" && order.completedAt &&
        now - new Date(order.completedAt).getTime() >= AUTO_COMPLETE_MS) {
      order.status = "paid";
    }
  }
}
```

---

## Phase 4：UI 体验增强

`4d999a9` | 9 files changed, +394 lines

**编码（组件复用）**：这个阶段创建了三个可复用业务组件，全部按 `CLAUDE.md` 规范放入 `src/components/features/`：

- `cat-avatar.tsx`——猫咪头像组件，根据猫咪品种显示不同颜色图标
- `chat-window.tsx`——聊天窗口组件，模拟猫主人与喂猫员的沟通
- `nav-button.tsx`——导航按钮组件，支持跳转高德/百度地图导航

**需求理解**：AI 推荐标签的实现体现了 Claude Code 对产品逻辑的理解——不是简单地随机标记，而是基于三个维度（猫多 → 工作量大收入高、价高 → 直接收益、日期近 → 紧急度）自动计算推荐分数，在 `pending-order-card.tsx` 中用橙色徽章突出显示。这个逻辑没有在需求中明确定义，是 Claude Code 作为"产品负责人"角色自主设计的。

---

## Phase 5：六大功能并行开发

`cafca9e` | 19 files changed, +739 lines

这是整个项目改动量最大的一次提交，同时实现了猫咪档案、评分系统、喂猫员主页、签到打卡、常用地址、加急订单六个功能。

**编码（自底向上的改动策略）**：Claude Code 严格分层推进：

1. 先改类型层：`types/index.ts` 新增 `Cat`、`Review`、`CheckIn` 接口
2. 再改服务层：新建 `cat-service.ts`、`review-service.ts`，扩展 `order-service.ts`（加 `URGENT_MULTIPLIER`、`addCheckIn`）
3. 然后改 Action 层：`actions.ts` 传递 rating/comment，记录 check-in
4. 最后改 UI 层：星级评分组件、加急开关、常用地址选择、签到时间线

这种顺序保证每一层改完后 TypeScript 类型都是通的，19 个文件的协调改动在一个 commit 里完成，没有中间的"半成品"状态。

**Code Review / 自我纠错**：这个阶段出现了两个典型错误：

- 变量重命名遗漏：把 `done` 改名为 `pendingReview` 后，JSX 里仍有一处 `done.length`，被 `tsc --noEmit` 捕获并立即修复
- Edit 工具边界问题：对 `tasks/page.tsx` 的部分编辑导致出现两个 `export default function`，发现后改用 Write 工具整体重写，而不是继续用 Edit 打补丁

经验：Claude Code + `tsc --noEmit` 形成了"改完即检查"的闭环，相当于每次改动后自动做一轮 Code Review。

---

## Phase 6：数据扩充 & 分页

`32402e6` | 5 files changed, +220 lines

**编码（可复用组件设计）**：用户说"帮忙再创建 50 个订单，每一页展示 5 条"，Claude Code 做了两件事：

1. 重写 `mock-data.ts`：用 `generateOrders()` 函数生成 50 条多样化数据（20 pending / 3 accepted / 3 in\_progress / 4 pending\_review / 20 paid），覆盖不同地址、猫数、加急状态
2. 创建 `components/features/pagination.tsx`：一个通用分页组件，接受 `total`、`pageSize`、`basePath` 三个 props，基于 `useRouter` + `useSearchParams` 实现客户端翻页

分页组件被三个页面复用（`/user`、`/feeder`、`/feeder/tasks`），每个页面只需一行代码接入：

```tsx
<Pagination total={allOrders.length} pageSize={PAGE_SIZE} basePath="/user" />
```

所有页面统一使用 Next.js 16 的异步 `searchParams` 模式：`searchParams: Promise<{ page?: string }>`，保持了架构一致性。

---

## Phase 7：Mock 数据缓存刷新

`5c40b8b` | 1 file changed, +4 lines

**测试/调试**：Phase 6 新增 50 条 Mock 数据后，发现开发服务器热重载时页面仍然显示旧数据。根因是 `globalThis.__orders` 在模块首次加载后就被缓存，后续代码修改不会触发重新初始化。

修复方案是引入版本号机制——用 `MOCK_ORDERS.length` 作为 `STORE_VERSION`，每次模块加载时比对版本号，不一致则刷新缓存：

```typescript
const STORE_VERSION = MOCK_ORDERS.length;
if (!globalForOrders.__orders || globalForOrders.__ordersVersion !== STORE_VERSION) {
  globalForOrders.__orders = [...MOCK_ORDERS];
  globalForOrders.__ordersVersion = STORE_VERSION;
}
```

这是一个只有 4 行的改动，但解决了开发体验中的关键痛点——改了 Mock 数据却看不到效果，开发者会反复怀疑自己的代码是否生效。Claude Code 在定位问题后选择了最小侵入的方案，没有引入额外的依赖或复杂的缓存失效策略。

---

## Phase 8：README 中文重写

`5d82183` | 1 file changed, +88 -20 lines

**文档**：将 `create-next-app` 生成的英文模板 README 完全重写为中文，结构化地呈现了项目全貌：

- 技术栈清单（Next.js 16 / TypeScript / Tailwind / shadcn/ui）
- 快速开始指南（安装、启动、环境变量配置）
- 功能概览表格：猫主人端 8 项功能、喂猫员端 8 项功能，用表格对齐便于快速扫描
- 订单状态机的 ASCII 流程图
- 项目目录结构树

README 的价值在于——它是项目的"门面"。对于比赛评审来说，一份结构清晰的中文 README 能在 30 秒内传达项目的完整度和专业度，比让评审自己去翻代码高效得多。

---

## Phase 9：订单删除功能

`8395265` (合入 Phase 10) | 3 files changed

**需求理解**：用户要求为"待接单"状态的订单增加删除功能。这是一个典型的"看似简单但需要全栈贯穿"的需求——从服务层到 Server Action 到 UI 组件，三层都要改。

**编码（分层实现）**：

1. **服务层** `order-service.ts`：新增 `deleteOrder(orderId, userId)` 方法，包含双重校验——订单必须属于当前用户 (`userId` 匹配) 且状态必须是 `pending`，防止误删已接单的订单
2. **Action 层** `user/actions.ts`：新增 `deleteOrder` Server Action，封装错误处理并返回统一的 `ActionResult` 结构
3. **UI 层** `user-order-card.tsx`：使用 `useTransition` 处理异步删除，`router.refresh()` 刷新页面数据

**Code Review / 迭代优化**：初版实现使用了全宽红色 `destructive` 按钮放在卡片底部，用户反馈"太鲜艳、太大"。第二版根据反馈调整为：

- 位置：从卡片底部移到"待接单"徽章正下方，用 `flex-col` 纵向排列
- 样式：改为与状态徽章同尺寸的圆角标签（`rounded-full px-2 py-0.5 text-xs`）
- 颜色：从红色改为低调的灰色（`bg-gray-100 text-gray-800`），hover 时加深

这次迭代体现了 UI 开发中的常见模式——功能正确只是第一步，视觉层级和交互细节需要根据用户反馈快速调整。Claude Code 在收到反馈后精准定位了三个调整维度（位置、尺寸、颜色），没有过度修改其他部分。

---

## Phase 10：照片墙 + 距离排序 + UX 优化

`8395265` | 18 files changed, +591 lines

这是项目后期改动量最大的一次提交，同时实现了四个功能：猫咪状态照片墙、距离排序、待审核弹窗推送、历史订单页面。

**架构设计（方案先行）**：在动手写代码之前，Claude Code 先产出了完整的实现方案，明确了两个功能的技术选型：

- 照片墙：用 emoji + 彩色背景 + 文字说明模拟"猫咪状态卡片"，避免引入文件上传的复杂度。定义了 9 张预设卡片（吃饭、睡觉、玩耍、梳毛等），喂猫员最多选 6 张
- 距离排序：给地址和喂猫员加经纬度坐标，用 Haversine 公式算距离，服务层返回 `[Order, distanceKm]` 元组

方案还明确了实现顺序：类型 → 工具函数 → Mock 数据 → 服务层 → UI 层，保证每一步都是类型安全的。

**编码（新建工具模块）**：

- `src/lib/cat-photo-cards.ts`：9 张猫咪状态卡片数据 + `getCardById` 查询函数，只有 25 行
- `src/lib/distance.ts`：Haversine 距离计算 + 格式化显示（<1km 显示米，≥1km 显示公里），只有 15 行
- `src/services/mock-data.ts`：10 个地址各配了南京江宁区的真实经纬度坐标，`pending_review` 订单预填了照片卡片 ID

**需求理解（排序切换的迭代）**：用户看到距离排序后提出"还要支持按时间排序"。Claude Code 用 URL query param `sort=distance|time` 实现，新建了 `sort-toggle.tsx` 客户端组件，切换时自动回到第一页。保持了 Server Component 架构不变，排序逻辑在服务端完成。

**需求理解（待审核弹窗推送）**：用户说"喂猫员完成的订单需要推送给铲屎官"。Claude Code 理解到 MVP 场景下不需要真正的 push notification，而是用弹窗模拟——进入"我的订单"页面时自动检测 `pending_review` 订单并弹窗提醒，列出所有待审核订单，点击"去审核"直接跳转支付流程。

**安全（删除权限放开的审慎处理）**：用户要求所有订单都能删除。Claude Code 在放开 `deleteOrder` 的状态限制时，保留了 `userId` 校验——确保用户只能删除自己的订单，不会误删他人数据。

**Code Review（build 捕获路径错误）**：`npm run build` 捕获了一个 import 路径错误——`history/history-order-card.tsx` 引用了 `./order-detail-dialog`，但文件在上级 `user/` 目录。修正为 `../order-detail-dialog` 后通过。这说明 `npm run build` 作为最终验证门禁的价值——`tsc --noEmit` 通过不代表 Next.js 的模块解析也能通过。

---

## Phase 11：文档同步更新

`694f430` | 3 files changed, +35 -17 lines

**版本管理（代码与文档同步）**：功能开发完成后，同步更新了三份文档：

- `README.md`：猫主人端功能表新增"历史订单"、"待审核提醒"、"删除订单"；喂猫员端新增"距离排序"、"排序切换"、"照片墙"；项目结构树新增 `history/`、`lib/cat-photo-cards.ts`、`lib/distance.ts`
- `ARCHITECTURE.md`：目录结构补充了新文件和新目录
- `REQUIREMENTS.md`：已实现的功能全部打勾（`[x]`），新增了"历史订单"、"待审核提醒"、"距离排序"等条目

文档和代码在同一个开发流程中维护，不会出现"代码改了文档没跟上"的脱节。

---

## Phase 12：猫咪日记 + 再来一单 + 服务时间线

`16e1d97` | 7 files changed, +161 lines

**需求理解（产品思维驱动的功能设计）**：这三个功能是 Claude Code 以产品经理角色主动建议的——猫咪日记提升情感化体验，再来一单降低复购门槛，服务时间线增强信任感。用户只说了"再增加一些有意思的小想法"，Claude Code 从用户体验角度自主设计了完整方案。

**编码（URL 参数传递的表单预填）**：再来一单的实现利用 URL search params 将历史订单的 catCount/address/notes/urgent 传递到创建页，创建页通过 `useSearchParams()` 读取并初始化表单状态。这种方案零额外状态管理，纯 URL 驱动。

**测试/调试（Suspense 边界问题）**：引入 `useSearchParams()` 后 `npm run build` 报错——Next.js 要求使用该 Hook 的组件必须包裹在 Suspense 边界内。修复方案：将原 `export default` 组件拆为 wrapper + inner，wrapper 用 `<Suspense>` 包裹 inner。这是 `npm run build` 作为最终门禁的又一次价值体现。

---

## 总结：Claude Code 协作模式复盘

### 开发效率

从 `create-next-app` 到功能完整的双端 MVP，整个项目通过 12 个 Phase 迭代完成。核心代码量约 9,500+ 行，涵盖 65+ 文件，包含完整的订单状态机、双端 UI、地址搜索、评价系统、分页、猫咪档案、照片墙、距离排序、历史订单、猫咪日记、再来一单、服务时间线等功能。

### 关键协作模式

**1. CLAUDE.md 驱动的一致性**

项目第一天就建立的 `CLAUDE.md` 规范贯穿了整个开发周期。从文件命名（`kebab-case`）到目录归属（`components/ui` vs `components/features`）到提交格式（`feat/fix/docs`），所有 Phase 的产出都自动遵循同一套规范，无需每次重复约定。这是 Claude Code 协作中 ROI 最高的投入。

**2. tsc --noEmit 作为质量门禁**

每次改动后运行 TypeScript 类型检查，形成了"编码 → 检查 → 修复"的紧密循环。Phase 5 中 19 个文件的协调改动能在一个 commit 里完成且类型安全，靠的就是这个即时反馈机制。

**3. 自底向上的分层改动**

多文件改动时始终遵循 类型 → 服务 → Action → UI 的顺序，保证每一层改完后 TypeScript 编译都是通的。这避免了"改到一半编译不过、不知道哪里断了"的混乱状态。

**4. 最小侵入原则**

无论是 Phase 7 的 4 行缓存修复，还是 Phase 3 的懒检查机制，Claude Code 始终选择最小改动量的方案。不引入不必要的依赖，不做过度设计，保持 MVP 的轻量特性。

**5. 用户反馈驱动的快速迭代**

Phase 9 的删除按钮经历了两轮迭代——先实现功能正确性，再根据用户反馈调整视觉细节。Claude Code 能准确理解"太鲜艳、太大"这类主观反馈背后的具体调整方向，而不是盲目猜测。

### 适用场景

这套协作模式特别适合：
- **MVP 快速验证**：需要在短时间内从零搭建功能完整的原型
- **全栈贯穿的功能开发**：一个需求涉及类型、服务、API、UI 多层改动
- **迭代式 UI 打磨**：功能先行，再根据反馈快速调整交互细节
