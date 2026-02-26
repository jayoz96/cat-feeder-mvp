# 答辩稿：Claude Code 开发经验分享

> 项目：上门喂猫 MVP | 10 个 commit，18 个文件改动，8000+ 行代码
> 从 create-next-app 到功能完整的双端平台，全程使用 Claude Code 协作完成

---

## 一、需求理解

**案例：从"上门喂猫 MVP"五个字到完整产品设计**

用户最初只给了一句话："构建一个上门喂猫的 MVP 产品"。Claude Code 在 REQUIREMENTS.md 的基础上，自主完成了以下需求拆解：

- 识别出双端角色：铲屎官（发需求）和喂猫员（接单执行）
- 设计了完整的订单状态机：`pending → accepted → in_progress → pending_review → paid`
- 推导出费用计算公式：按天 × 猫数 × 加急系数
- 选择 globalThis 内存持久化而非数据库——准确理解了"MVP 追求速度"的约束

**案例：AI 推荐标签的自主设计**（commit `4d999a9`）

需求中没有定义"推荐逻辑"，Claude Code 作为产品负责人角色，自主设计了三维度推荐算法：
- 猫多（≥2只）→ 工作量大收入高
- 价高（≥300元）→ 直接收益
- 日期近（≤5天）→ 紧急度

这不是随机标记，而是基于喂猫员利益最大化的产品思考。

**案例：待审核弹窗推送**（commit `8395265`）

用户说"喂猫员完成的订单需要推送给铲屎官"。Claude Code 理解到这不是技术意义上的 push notification，而是在 MVP 场景下用弹窗模拟推送——进入"我的订单"页面时自动检测 pending_review 订单并弹窗提醒，点击"去审核"直接跳转支付流程。用最小成本实现了核心体验。

---

## 二、架构设计

**案例：Plan Mode 驱动的状态机扩展**（commit `b84bbe5`）

这是整个项目唯一使用 Plan Mode 的阶段。在给订单加"审核支付"流程时，没有直接写代码，而是先产出方案文档：

- 状态机扩展：新增 `pending_review` 和 `paid` 两个状态
- 文件改动清单：精确到每个文件的职责（types 加枚举、order-service 加 reviewAndPay、新建 review-dialog.tsx）
- 降级策略：高德 API 不可用时回退到本地地址库

Plan Mode 的价值：先对齐方案再动手，避免写到一半发现架构不对要推翻重来。本质上是把"设计评审"内置到了开发流程里。

**案例：照片墙 + 距离排序的分层方案设计**（commit `8395265`）

两个功能同时开发，Claude Code 先产出了完整的实现方案：
- 照片墙：用 emoji + 彩色背景模拟照片卡片，避免引入文件上传的复杂度
- 距离排序：Haversine 公式 + 坐标数据，服务层返回 `[Order, distanceKm]` 元组

方案明确了实现顺序：类型 → 工具函数 → Mock 数据 → 服务层 → UI 层。18 个文件的协调改动在一个 commit 里完成，没有中间的"半成品"状态。

---

## 三、编码

**案例：自底向上的分层改动策略**（commit `cafca9e`，19 files，+739 lines）

同时实现猫咪档案、评分系统、喂猫员主页、签到打卡、常用地址、加急订单六个功能。Claude Code 严格分层推进：

1. 先改类型层：`types/index.ts` 新增 CatProfile、Review、CheckIn 接口
2. 再改服务层：新建 cat-service.ts、review-service.ts
3. 然后改 Action 层：actions.ts 传递 rating/comment
4. 最后改 UI 层：星级评分、加急开关、签到时间线

这种顺序保证每一层改完后 TypeScript 类型都是通的。

**案例：通用分页组件的设计**（commit `32402e6`）

用户说"每页展示 5 条"，Claude Code 没有在每个页面重复写分页逻辑，而是创建了 `pagination.tsx` 通用组件，接受 total、pageSize、basePath 三个 props。被 /user、/feeder、/feeder/tasks 三个页面复用，每个页面只需一行代码：

```tsx
<Pagination total={allOrders.length} pageSize={PAGE_SIZE} basePath="/user" />
```

**案例：Haversine 距离计算**（commit `8395265`）

`src/lib/distance.ts` 只有 15 行，实现了完整的球面距离计算 + 格式化显示（<1km 显示米，≥1km 显示公里）。服务层的 `getPendingOrdersSorted` 返回元组数组，UI 层无需关心计算细节，只需要渲染距离标签。

---

## 四、Code Review

**案例：tsc --noEmit 作为自动 Code Review 门禁**

每次改动后运行 `tsc --noEmit`，形成"编码 → 检查 → 修复"的紧密循环。具体捕获的问题：

- Phase 5：变量从 `done` 改名为 `pendingReview` 后，JSX 里仍有一处 `done.length`，被类型检查立即捕获
- Phase 9（照片墙）：18 个文件改动后 `tsc --noEmit` 一次通过，验证了分层改动策略的可靠性

**案例：npm run build 作为最终验证**

每个功能完成后都跑一次 `npm run build`，确保不只是类型正确，还能通过 Next.js 的完整编译（包括 Server Component 的序列化检查、动态路由生成等）。照片墙功能中，build 捕获了一个 import 路径错误——`history-order-card.tsx` 引用了 `./order-detail-dialog` 但文件在上级目录，修正为 `../order-detail-dialog` 后通过。

**案例：删除按钮的 UI 迭代**（commit `8395265`）

初版删除按钮用了全宽红色 destructive 样式，用户反馈"太鲜艳、太大"。Claude Code 精准定位三个调整维度：
- 位置：从卡片底部移到状态徽章下方
- 尺寸：改为与徽章同尺寸的圆角标签
- 颜色：从红色改为低调灰色

没有过度修改其他部分，只改了需要改的。

---

## 五、测试

**案例：懒检查机制替代定时器**（commit `9a2707b`）

`pending_review` 超过 3 小时需要自动转为 `paid`。没有引入定时器或 cron job，而是在每个查询方法入口调用 `autoCompleteExpired()`：

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

零额外基础设施，每次读取时自动校验数据一致性。

**案例：Mock 数据缓存刷新问题**（commit `5c40b8b`）

新增 50 条 Mock 数据后，开发服务器热重载时页面仍显示旧数据。根因：`globalThis.__orders` 在模块首次加载后被缓存。修复方案只有 4 行——用 `MOCK_ORDERS.length` 作为版本号，不一致则刷新：

```typescript
const STORE_VERSION = MOCK_ORDERS.length;
if (!globalForOrders.__orders || globalForOrders.__ordersVersion !== STORE_VERSION) {
  globalForOrders.__orders = [...MOCK_ORDERS];
  globalForOrders.__ordersVersion = STORE_VERSION;
}
```

最小侵入，解决了开发体验的关键痛点。

---

## 六、安全

**案例：API Key 保护与降级策略**（commit `b84bbe5`）

高德地址搜索的安全设计：
- API Key 通过 `NEXT_PUBLIC_AMAP_KEY` 环境变量注入，`.env.local` 被 `.gitignore` 排除，不会泄露到 Git
- `address-picker.tsx` 对 API 调用做了 try/catch，失败时静默降级为本地地址库，不向前端暴露错误详情
- 用户手机号脱敏显示（`138****1234`），地址信息只在订单上下文中展示

**案例：deleteOrder 的权限校验**（commit `8395265`）

删除订单的服务层实现了 userId 校验——`order.userId !== userId` 时返回 false，防止用户 A 删除用户 B 的订单。虽然 MVP 阶段用的是 Mock 用户，但安全边界从第一天就建立了，后续接入真实认证时无需重构。

---

## 七、版本管理

**案例：语义化 commit 历史**

整个项目 10 个 commit，严格遵循 CLAUDE.md 定义的提交规范：

```
feat: implement MVP core flow
feat: add address search and review-payment flow
fix: force-dynamic pages, amap address search
feat: add cat avatars, AI recommendation tags
feat: add 6 new features - cat profiles, ratings...
feat: add 50 mock orders and pagination
fix: refresh mock data cache
docs: rewrite README in Chinese
feat: add photo wall, distance sorting, history orders
docs: update README, ARCHITECTURE, REQUIREMENTS
```

每个 commit 都是一个完整的、可运行的功能增量，没有"WIP"或"fix typo"的噪音。

**案例：功能代码与文档同步更新**（commit `694f430`）

每次功能开发完成后，同步更新三份文档：
- README.md：功能概览表格、项目结构树
- ARCHITECTURE.md：目录结构
- REQUIREMENTS.md：已实现功能打勾

文档和代码在同一个开发流程中维护，不会出现"代码改了文档没跟上"的脱节。

---

## 加分项：CLAUDE.md 工程经验

**CLAUDE.md 是整个项目 ROI 最高的投入。**

在写任何业务代码之前，先创建了这份"项目宪法"，定义了：

1. **构建命令置顶**：`npm run dev` / `npm run build` / `tsc --noEmit`，确保 Claude Code 每次改动后知道如何验证
2. **目录结构约定**：`components/ui` vs `components/features` vs `services`，新文件自动放到正确位置
3. **命名规范**：文件 kebab-case、组件 PascalCase、常量 UPPER_SNAKE_CASE
4. **Git 提交规范**：feat/fix/docs 前缀
5. **Agent 协作规则**：思考先行、上下文感知、质量保证、主动沟通

写一次，整个开发周期持续生效。后续所有 Phase 的文件命名、目录归属、提交格式都自动遵循，无需反复提醒。

## 加分项：协作分工模式

整个项目的人机协作模式是：

- **人（我）**：定义需求方向、审核 UI 效果、提出体验优化建议
- **Claude Code**：需求拆解、架构设计、编码实现、自我检查、文档维护

典型的协作循环：
1. 我说"接单大厅要支持按距离排序"
2. Claude Code 产出完整方案（Haversine 公式 + 坐标数据 + 排序切换 UI）
3. 我看效果后说"还要支持按时间排序切换"
4. Claude Code 用 URL query param 实现排序切换，保持 Server Component 架构不变

这种模式下，我专注于"做什么"和"好不好"，Claude Code 负责"怎么做"和"做对没有"。
