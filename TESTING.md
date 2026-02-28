# 测试方案 - 上门喂猫 MVP

> 本文档定义了项目的测试策略、测试用例和质量保障机制。

## 测试策略

### 当前质量门禁（已实施）

| 门禁 | 命令 | 作用 |
|------|------|------|
| TypeScript 类型检查 | `npx tsc --noEmit` | 每次改动后运行，捕获类型错误、变量重命名遗漏 |
| Next.js 完整编译 | `npm run build` | 功能完成后运行，验证模块解析、Server Component 序列化、Suspense 边界 |
| ESLint 代码检查 | `npm run lint` | 检查代码规范和潜在问题 |

### 推荐测试框架

- **单元测试**: Vitest（与 Vite 生态兼容，支持 TypeScript，零配置）
- **组件测试**: React Testing Library + Vitest
- **E2E 测试**: Playwright（可选，MVP 阶段优先级低）

### 安装命令

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 配置（vitest.config.ts）

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

---

## 单元测试用例

### 1. OrderService（订单服务）

**文件**: `src/services/__tests__/order-service.test.ts`

#### 1.1 创建订单

| 用例 | 输入 | 预期结果 |
|------|------|---------|
| 普通订单费用计算 | 2 天、2 只猫、非加急 | `totalPrice = 2 × 50 × 2 = 200` |
| 加急订单费用计算 | 2 天、1 只猫、加急 | `totalPrice = 2 × 50 × 1 × 1.5 = 150` |
| 单日订单（同一天） | startDate = endDate | `days = 1`，不为 0 |
| 订单初始状态 | 任意合法输入 | `status = "pending"`，无 feederId |

#### 1.2 订单状态流转（状态机）

| 用例 | 前置状态 | 操作 | 预期结果 |
|------|---------|------|---------|
| 正常接单 | pending | `acceptOrder` | status → accepted，feederId 已赋值 |
| 重复接单 | accepted | `acceptOrder` | 返回 null，状态不变 |
| 正常开始服务 | accepted | `startOrder` | status → in_progress |
| 未接单直接开始 | pending | `startOrder` | 返回 null |
| 正常完成服务 | in_progress | `completeOrder` | status → pending_review |
| 带反馈完成 | in_progress | `completeOrder` (带 feedback) | feedbackNote 和 feedbackPhotos 已保存 |
| 正常审核支付 | pending_review | `reviewAndPay` | status → paid |
| 带评分支付 | pending_review | `reviewAndPay(id, 5, "很好")` | userRating = 5, reviewComment = "很好" |
| 非法状态支付 | accepted | `reviewAndPay` | 返回 null |

#### 1.3 完整状态流转链路

```
createOrder → acceptOrder → startOrder → completeOrder → reviewAndPay
  (pending)    (accepted)   (in_progress) (pending_review)   (paid)
```

验证一个订单走完完整生命周期后各字段正确。

#### 1.4 删除订单

| 用例 | 条件 | 预期结果 |
|------|------|---------|
| 正常删除自己的订单 | userId 匹配 | 返回 true，订单从列表移除 |
| 删除他人订单 | userId 不匹配 | 返回 false，订单仍在 |
| 删除不存在的订单 | orderId 无效 | 返回 false |

#### 1.5 超时自动完结

| 用例 | 条件 | 预期结果 |
|------|------|---------|
| 超过 3 小时自动转 paid | completedAt 为 4 小时前 | 查询时 status 自动变为 paid |
| 未超时不转换 | completedAt 为 1 小时前 | 查询时 status 仍为 pending_review |
| 无 completedAt 不转换 | completedAt 为空 | status 不变 |

#### 1.6 距离排序

| 用例 | 条件 | 预期结果 |
|------|------|---------|
| 按距离升序排列 | 3 个不同距离的订单 | 返回数组按距离从近到远 |
| 无坐标的订单排最后 | 部分订单无 location | 无坐标订单距离为 Infinity，排在末尾 |

#### 1.7 签到打卡

| 用例 | 条件 | 预期结果 |
|------|------|---------|
| 签到成功 | 有效 orderId | 返回 CheckIn 对象，type = "arrive" |
| 签退成功 | 有效 orderId | 返回 CheckIn 对象，type = "leave" |
| 无效订单签到 | orderId 不存在 | 返回 null |

---

### 2. CatService（猫咪档案服务）

**文件**: `src/services/__tests__/cat-service.test.ts`

| 用例 | 操作 | 预期结果 |
|------|------|---------|
| 按主人查询 | `getByOwner("user-1")` | 返回该用户的所有猫咪 |
| 按 ID 查询 | `getById("cat-1")` | 返回对应猫咪，不存在返回 null |
| 批量查询 | `getByIds(["cat-1", "cat-2"])` | 返回匹配的猫咪数组 |
| 创建猫咪 | `create({name: "橘子", ...})` | 返回带自动生成 id 的猫咪对象 |

---

### 3. ReviewService（评价服务）

**文件**: `src/services/__tests__/review-service.test.ts`

| 用例 | 操作 | 预期结果 |
|------|------|---------|
| 创建评价 | `create({rating: 5, ...})` | 返回带 id 和 createdAt 的评价 |
| 按用户查询 | `getByUser("feeder-1")` | 返回该喂猫员收到的所有评价 |
| 按订单查询 | `getByOrder("order-1")` | 返回对应评价，不存在返回 null |
| 平均评分计算 | 3 条评价（5, 4, 3） | avg = 4.0, count = 3 |
| 无评价时 | `getAverageRating("new-user")` | avg = 0, count = 0 |

---

### 4. distance.ts（距离计算）

**文件**: `src/lib/__tests__/distance.test.ts`

| 用例 | 输入 | 预期结果 |
|------|------|---------|
| 同一点距离为 0 | 两点坐标相同 | `haversineDistance` 返回 0 |
| 南京 → 上海 约 300km | (32.06, 118.79) → (31.23, 121.47) | 结果在 270~310km 范围内 |
| 短距离格式化 | 0.5km | `formatDistance` 返回 `"500m"` |
| 长距离格式化 | 3.456km | `formatDistance` 返回 `"3.5km"` |
| 零距离格式化 | 0km | `formatDistance` 返回 `"0m"` |

---

### 5. cat-photo-cards.ts（猫咪状态卡片）

**文件**: `src/lib/__tests__/cat-photo-cards.test.ts`

| 用例 | 操作 | 预期结果 |
|------|------|---------|
| 卡片总数 | `CAT_PHOTO_CARDS.length` | 等于 9 |
| 按 ID 查找 | `getCardById("eating")` | 返回 emoji = "😋" |
| 不存在的 ID | `getCardById("xxx")` | 返回 undefined |
| 所有卡片有唯一 ID | 遍历检查 | 无重复 id |

---

## 安全相关测试

### 权限校验

| 用例 | 操作 | 预期结果 |
|------|------|---------|
| 用户 A 不能删除用户 B 的订单 | `deleteOrder(orderOfB, userA)` | 返回 false |
| 只有 pending 可接单 | 对 accepted 订单调 `acceptOrder` | 返回 null |
| 只有 pending_review 可支付 | 对 accepted 订单调 `reviewAndPay` | 返回 null |

### 输入边界

| 用例 | 操作 | 预期结果 |
|------|------|---------|
| 不存在的订单 ID | `getOrderById("invalid")` | 返回 null |
| 空字符串查询 | `getOrdersByUser("")` | 返回空数组 |

---

## 集成测试建议（Server Actions）

Server Actions 层（`src/app/(dashboard)/user/actions.ts`）适合集成测试：

| 用例 | 操作 | 预期结果 |
|------|------|---------|
| 删除成功 | `deleteOrder(validId)` | `{ success: true, message: "订单已删除" }` |
| 删除失败 | `deleteOrder("")` | `{ success: false, message: "订单 ID 不能为空" }` |
| 审核支付成功 | `reviewAndPay(validId, 5)` | `{ success: true }` 且评价记录已创建 |
| 审核支付无效 ID | `reviewAndPay("")` | `{ success: false, message: "订单 ID 不能为空" }` |

---

## 测试覆盖率目标

| 模块 | 目标覆盖率 | 优先级 |
|------|-----------|--------|
| `order-service.ts` | ≥ 90% | **P0** — 核心业务逻辑 |
| `distance.ts` | 100% | **P0** — 纯函数，易测 |
| `cat-photo-cards.ts` | 100% | **P1** — 纯数据，易测 |
| `cat-service.ts` | ≥ 80% | **P1** — CRUD |
| `review-service.ts` | ≥ 80% | **P1** — CRUD + 聚合计算 |
| Server Actions | ≥ 70% | **P2** — 集成测试 |
| UI 组件 | ≥ 50% | **P3** — MVP 阶段可后置 |
