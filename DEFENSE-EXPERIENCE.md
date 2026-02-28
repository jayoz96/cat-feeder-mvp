# 上门喂猫 MVP — Claude Code 开发经验答辩

> 12 个迭代阶段 · 49 个源文件 · 9,500+ 行代码 · 从 `create-next-app` 到功能完整的双端平台

---

## 一、需求理解：从一句话到完整状态机

**场景**：用户只说了"做一个上门喂猫的 MVP"，没有给出任何功能细节。

**Claude Code 的做法**：基于 `REQUIREMENTS.md` 自动拆解出完整的业务模型——

- 识别出双端角色（猫主人 vs 喂猫员）并设计了差异化的功能集
- 设计了 5 状态订单状态机：`pending → accepted → in_progress → pending_review → paid`
- 推导出费用计算公式：`天数 × 每日单价 × 猫数 × 加急倍率`

```typescript
// src/services/order-service.ts:83-87
const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
const multiplier = input.urgent ? URGENT_MULTIPLIER : 1;
const totalPrice = Math.round(days * PRICE_PER_DAY * input.catCount * multiplier);
```

**另一个例子**：用户说"喂猫员完成的订单需要推送给铲屎官"。Claude Code 理解到 MVP 场景下不需要真正的 push notification，而是用**进入页面自动弹窗检测**来模拟推送——检测 `pending_review` 状态订单并弹窗提醒"去审核"，精准匹配了 MVP 的能力边界。

---

## 二、架构设计：Plan Mode 方案先行

**场景**：Phase 2 需要同时加入"地址搜索"和"审核支付流程"两个跨层功能。

**Claude Code 的做法**：这是整个项目中唯一使用了 **Plan Mode** 的阶段。在动手写代码之前，先产出了完整方案文档：

1. **状态机扩展**：明确新增 `pending_review` 和 `paid` 两个状态
2. **文件改动清单**：精确到每个文件的职责（`types` 加枚举、`order-service` 加 `reviewAndPay`、新建 `review-dialog.tsx`）
3. **降级策略**：高德 API 不可用时回退到本地地址库

Plan Mode 的价值：**先对齐方案再动手写代码**，避免写到一半发现架构不对要推翻重来。本质上是把"设计评审"内置到了开发流程里。

### 核心架构决策

| 决策 | 选择 | 理由 |
|------|------|------|
| 数据持久化 | `globalThis` 内存存储 | MVP 追求速度，避免数据库配置复杂度 |
| API 层 | Server Actions | 替代 API Routes，减少样板代码 |
| 超时完结 | 懒检查机制 | 零额外基础设施，每次查询时扫描过期订单 |
| 分页/排序 | URL search params | 无额外状态管理库，纯 URL 驱动 |

---

## 三、编码：自底向上的分层改动策略

**场景**：Phase 5 一次性实现 6 个功能（猫咪档案、评分、喂猫员主页、签到、常用地址、加急订单），涉及 19 个文件。

**Claude Code 的做法**：严格按 **类型 → 服务 → Action → UI** 的顺序分层推进：

```
1. types/index.ts        → 新增 Cat, Review, CheckIn 接口
2. cat-service.ts        → 猫咪档案 CRUD
   review-service.ts     → 评价系统
   order-service.ts      → 加 URGENT_MULTIPLIER、addCheckIn
3. actions.ts            → 传递 rating/comment，记录 check-in
4. 各页面 UI 组件        → 星级评分、加急开关、签到时间线
```

这种顺序保证**每一层改完后 TypeScript 类型都是通的**，19 个文件的协调改动在一个 commit 里完成，没有中间的"半成品"状态。

**可复用组件示例**：`pagination.tsx` 被三个页面复用（`/user`、`/feeder`、`/feeder/tasks`），每个页面只需一行代码接入：

```tsx
<Pagination total={allOrders.length} pageSize={PAGE_SIZE} basePath="/user" />
```

---

## 四、Code Review：tsc + build 双门禁 + 用户反馈迭代

整个项目的 Code Review 由三层机制组成：**tsc 类型检查 → build 编译验证 → 人工体验审核**。

### 4.1 tsc --noEmit 作为自动 Code Review

每次改动后运行 `tsc --noEmit`，形成 **"编码 → 检查 → 修复"** 的紧密闭环。具体捕获的问题：

- **Phase 5**：变量从 `done` 改名为 `pendingReview` 后，JSX 里仍有一处 `done.length`，被类型检查立即捕获并修复
- **Phase 5**：Edit 工具对 `tasks/page.tsx` 的部分编辑导致出现两个 `export default function`，发现后改用 Write 工具整体重写，而不是继续用 Edit 打补丁
- **Phase 10**：18 个文件的照片墙 + 距离排序改动后 `tsc --noEmit` 一次通过，验证了分层改动策略的可靠性

### 4.2 npm run build 作为最终门禁

`tsc --noEmit` 通过不代表 Next.js 的完整编译也能通过。`npm run build` 是比类型检查**更严格的最终门禁**：

- **Phase 10**：`history/history-order-card.tsx` 引用了 `./order-detail-dialog`，但文件实际在上级 `user/` 目录。tsc 通过但 build 报错，修正为 `../order-detail-dialog` 后通过
- **Phase 12**：引入 `useSearchParams()` 后 build 报错——Next.js 要求该 Hook 必须包裹在 `<Suspense>` 内。修复方案：

```tsx
// 拆为 wrapper + inner，wrapper 用 Suspense 包裹
export default function CreateOrderPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <CreateOrderInner />
    </Suspense>
  );
}
```

### 4.3 用户反馈驱动的 UI 迭代

**删除按钮的两轮迭代**：初版用了全宽红色 `destructive` 按钮放在卡片底部，用户反馈"太鲜艳、太大"。Claude Code 精准定位三个调整维度，没有过度修改其他部分：

| 维度 | 第一版 | 第二版 |
|------|--------|--------|
| 位置 | 卡片底部独占一行 | "待接单"徽章正下方，flex-col 纵向排列 |
| 尺寸 | 全宽按钮 | 与徽章同尺寸的圆角标签 (`rounded-full px-2 py-0.5 text-xs`) |
| 颜色 | 红色 destructive | 低调灰色 (`bg-gray-100 text-gray-800`)，hover 加深 |

这体现了 UI 开发的常见模式——功能正确只是第一步，视觉层级和交互细节需要根据用户反馈快速调整。

---

## 五、测试与调试：懒检查机制替代定时器

**场景**：`pending_review` 状态的订单需要 3 小时后自动完结，但 MVP 不想引入 cron job 或定时器。

**Claude Code 的做法**：实现**懒检查（Lazy Evaluation）**——在每个查询方法入口调用 `autoCompleteExpired()`，零额外基础设施：

```typescript
// src/services/order-service.ts:30-41
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

**Phase 7 的缓存刷新问题**：修改 Mock 数据后开发服务器仍显示旧数据。根因是 `globalThis.__orders` 被缓存，修复方案只有 4 行——用 `MOCK_ORDERS.length` 作为版本号，不一致则刷新：

```typescript
const STORE_VERSION = MOCK_ORDERS.length;
if (!globalForOrders.__orders || globalForOrders.__ordersVersion !== STORE_VERSION) {
  globalForOrders.__orders = [...MOCK_ORDERS];
  globalForOrders.__ordersVersion = STORE_VERSION;
}
```

**最小侵入原则**：不引入额外依赖或复杂缓存策略，4 行代码解决开发体验的关键痛点。

---

## 六、安全：API Key 保护 + 权限校验 + 降级策略

这是整个项目中安全实践最密集的领域，体现在三个层面：

### 6.1 API Key 防泄露

高德地址搜索的 API Key 通过 `NEXT_PUBLIC_AMAP_KEY` 环境变量注入，`.env.local` 被 `.gitignore` 排除，**密钥永远不会进入 Git 仓库**。

### 6.2 优雅降级，不暴露错误详情

`address-picker.tsx` 对高德 API 调用做了 `try/catch`，失败时**静默降级到本地地址库**，不向前端暴露任何错误堆栈或 API 细节：

```typescript
// src/components/features/address-picker.tsx:77-103
if (AMAP_KEY) {
  try {
    const res = await fetch(`https://restapi.amap.com/v3/assistant/inputtips?...&key=${AMAP_KEY}`);
    // ... 解析结果
  } catch {
    // 远程失败，降级到本地搜索——不暴露任何错误信息
  }
}
// 本地模糊搜索兜底
const results = localSearch(keyword);
```

### 6.3 删除操作的权限校验

`deleteOrder` 方法保留了 **userId 校验**——即使放开了所有状态的删除限制，仍确保用户只能删除自己的订单：

```typescript
// src/services/order-service.ts:160-167
deleteOrder(orderId: string, userId: string): boolean {
  const store = getStore();
  const order = store.find((o) => o.id === orderId);
  if (!order || order.userId !== userId) return false;  // 权限校验
  setStore(store.filter((o) => o.id !== orderId));
  return true;
}
```

### 6.4 Server Action 层的输入校验

所有 Server Action 对输入参数做了空值校验，用统一的 `ActionResult` 结构返回用户友好的错误提示，不暴露内部实现：

```typescript
// src/app/(dashboard)/user/actions.ts:11-25
export async function deleteOrder(orderId: string): Promise<ActionResult> {
  if (!orderId) {
    return { success: false, message: "订单 ID 不能为空" };
  }
  try {
    const deleted = OrderService.deleteOrder(orderId, "user-1");
    if (!deleted) return { success: false, message: "订单不存在或无法删除" };
    return { success: true, message: "订单已删除" };
  } catch {
    return { success: false, message: "删除失败，请稍后重试" };  // 不暴露内部错误
  }
}
```

### 6.5 状态流转的严格校验

每个状态变更方法都检查当前状态是否合法，防止非法跳转：

```typescript
acceptOrder → 只允许 pending 状态
startOrder  → 只允许 accepted 状态
completeOrder → 只允许 accepted 或 in_progress 状态
reviewAndPay → 只允许 pending_review 状态
```

---

## 七、版本管理：代码与文档同步的 Git 实践

**提交规范**：整个项目严格遵循 `CLAUDE.md` 定义的 Git 规范，12 次提交全部使用语义化前缀：

```
fe17f8c docs: update docs with Phase 12 features and add defense PPT
16e1d97 feat: add cat diary, reorder button, and service timeline
ea56c19 docs: add defense script and update development experience
694f430 docs: update README, ARCHITECTURE, REQUIREMENTS with new features
8395265 feat: add photo wall, distance sorting, history orders, and UX improvements
32402e6 feat: add 50 mock orders and pagination (5 per page)
5c40b8b fix: refresh mock data cache when order count changes
cafca9e feat: add 6 new features - cat profiles, ratings, ...
4d999a9 feat: add cat avatars, AI recommendation tags, order detail page
```

**文档同步策略**：功能开发完成后，同一个开发流程中立即更新 README.md、ARCHITECTURE.md、REQUIREMENTS.md，不会出现"代码改了文档没跟上"的脱节。例如 Phase 11 专门用一个 commit 同步三份文档。

---

## 八、CLAUDE.md 工程经验：项目的"宪法"

`CLAUDE.md` 是整个项目 ROI 最高的投入——**写一次，整个开发周期持续生效**。

### 8.1 它定义了什么

| 维度 | 内容 | 效果 |
|------|------|------|
| **构建命令** | `npm run dev` / `npm run build` / `tsc --noEmit` 置顶 | Claude Code 每次改动后知道如何验证 |
| **目录约定** | `components/ui` vs `components/features` vs `services` | 新文件自动放到正确位置 |
| **命名规范** | 文件 `kebab-case`、组件 `PascalCase`、常量 `UPPER_SNAKE_CASE` | 12 个 Phase 风格完全统一 |
| **提交格式** | `feat/fix/docs` 语义化前缀 | commit 历史可读且可追溯 |
| **协作规则** | 思考先行、上下文感知、质量门禁 | 避免盲目编码 |

### 8.2 实际效果

- **Phase 5** 一次性新增 19 个文件，全部自动遵循目录归属和命名规范
- **Phase 6** 新建 `pagination.tsx` 时，Claude Code 自动将其归入 `components/features/` 而非 `components/ui/`，因为 CLAUDE.md 明确了"业务组件放 features"
- 整个项目零次因文件位置或命名不一致而需要重构

### 8.3 持续迭代

CLAUDE.md 本身也在随项目演进——初版写的是 `Next.js 14+` 和 `Supabase`，项目实际使用 Next.js 16 和 globalThis 内存存储后，及时更新为真实技术栈，保持文档与代码的一致性。

---

## 九、协作分工：人机各司其职

### 角色分配

| 角色 | 职责 | 实际案例 |
|------|------|---------|
| **人（产品方向）** | 定义需求方向、验收 UI、提出体验反馈 | "删除按钮太鲜艳太大" → Claude Code 精准调整位置/尺寸/颜色三个维度 |
| **Claude Code（执行+产品建议）** | 架构设计、编码实现、自测、文档维护 | 用户说"加点有意思的功能" → 自主设计猫咪日记、再来一单、服务时间线 |

### 协作模式

1. **人说"做什么"，Claude Code 决定"怎么做"**
   - 用户："帮我加距离排序" → Claude Code 自主选择 Haversine 公式、设计 `[Order, distanceKm]` 元组返回、创建 `distance.ts` 工具模块

2. **Claude Code 主动建议，人做决策**
   - AI 推荐标签不是需求中明确定义的，而是 Claude Code 作为"产品负责人"角色自主设计的——基于猫数、价格、日期紧急度三个维度自动计算推荐分数

3. **快速反馈迭代**
   - 删除按钮：第一版全宽红色按钮 → 用户反馈"太鲜艳" → 第二版调整为灰色小圆角标签，精准响应反馈

### 质量保障闭环

```
编码 → tsc --noEmit（类型安全）→ npm run build（模块解析）→ 人工验收（UI/UX）
  ↑                                                              ↓
  ←——————————————————— 反馈修复 ←————————————————————————————————←
```

---

## 十、Skill 运用：高效工具链

### 使用的 Claude Code 能力

| 能力 | 场景 | 效果 |
|------|------|------|
| **Plan Mode** | Phase 2 地址搜索 + 审核支付架构设计 | 方案先行，避免返工 |
| **多文件协调编辑** | Phase 5 一次性改 19 个文件 | 保持类型安全的前提下一个 commit 完成 |
| **自我纠错** | Edit 工具导致重复 `export default` | 发现后改用 Write 整体重写，不继续打补丁 |
| **最小侵入修复** | Phase 7 缓存刷新 bug | 4 行代码解决，不引入额外依赖 |
| **文档同步** | 每个功能 Phase 后更新三份文档 | 代码和文档始终一致 |

### 关键经验总结

1. **CLAUDE.md 是基础设施**：投入一次，整个项目持续受益，是协作效率的倍增器
2. **tsc + build 是质量底线**：比人工 Code Review 更快、更全面、更不会遗漏
3. **自底向上改动**：多文件修改时，类型 → 服务 → UI 的顺序保证每一步都可验证
4. **MVP 的安全不能省**：即使是 Mock 数据项目，权限校验、输入验证、错误降级仍然完整实现
5. **人机协作的关键**：人把控方向和体验，Claude Code 负责执行和技术决策，各司其职效率最高
