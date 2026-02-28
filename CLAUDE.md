# CLAUDE.md - Agentic Coding 协作协议与项目规范

> **项目目标**: 为 Agentic Coding 比赛构建一个“上门喂猫”的 MVP 产品。
> **你的角色**: 高级全栈工程师 & 产品负责人 (Senior Full-Stack Engineer & Product Owner)

## 🛠️ 构建与运行命令 (Build & Run)
- `npm run dev`      - 启动开发服务器 (默认端口 3000)
- `npm run build`    - 构建生产版本
- `npm run lint`     - 运行 ESLint 检查代码质量
- `npx tsc --noEmit`  - TypeScript 类型检查
- `npx shadcn-ui@latest add [组件名]` - 添加 Shadcn UI 组件

## 🏗️ 架构与技术栈 (Architecture & Tech Stack)
- **框架**: Next.js 16 (App Router, Server Actions)
- **样式**: Tailwind CSS 4 + Shadcn UI (Radix Primitives)
- **语言**: TypeScript (启用严格模式)
- **数据持久化**: 内存 Mock 数据 (globalThis 持久化，50 条模拟订单)
- **地址服务**: 高德 Web 服务 API + 本地地址库降级
- **图标库**: Lucide React

## 📝 编码标准与风格指南 (Coding Standards)
- **组件 (Components)**:
  - 使用函数式组件，采用 `PascalCase` 命名。
  - 通用组件放在 `src/components/ui`，业务组件放在 `src/components/features`。
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
  - 异步函数中使用 `try/catch` 块。
  - 显示用户友好的错误提示 (例如使用 Toast 通知)。
- **注释**:
  - 为复杂逻辑编写 JSDoc。
  - 解释 *为什么* 这样做，而不仅仅是 *做了什么*。

## 🤖 Agent 协作规则 (团队模式)
1. **思考先行 (Think Before Coding)**:
   - 编写代码前，先分析 `REQUIREMENTS.md` 中的需求。
   - 将复杂任务拆解为更小的、可验证的步骤。
2. **上下文感知 (Context Awareness)**:
   - 始终检查 `ARCHITECTURE.md` 以确保设计一致性。
   - 完成主要任务后更新 `PROGRESS.md`。
3. **质量保证 (Quality Assurance)**:
   - 重大更改后运行 `tsc --noEmit` 检查类型错误。
   - 确保没有阻塞性 Bug 后再标记任务为“已完成”。
4. **沟通 (Communication)**:
   - 如果需求模棱两可，主动提出澄清问题。
   - 清晰、简洁地总结变更内容。

## 📦 项目目录结构
```text
/src
  /app              # App Router 页面与布局
    /(dashboard)    # 控制台路由组
      /user         # 猫主人端 (订单、猫咪档案、日记、历史)
      /feeder       # 喂猫员端 (接单大厅、任务、个人主页)
  /components       # 可复用 UI 组件
    /ui             # Shadcn/基础组件
    /features       # 业务逻辑组件 (地址选择、分页、聊天等)
  /lib              # 工具函数 (距离计算、猫咪状态卡片)
  /types            # TypeScript 类型定义
  /services         # 数据服务层 (订单、猫咪、评价、Mock 数据)

🚀 Git 提交规范 (Commit Convention)
feat(scope): 新增功能 (例如 feat(auth): add google login)
fix(scope): 修复 Bug (例如 fix(home): resolve layout shift)
docs(scope): 文档变更 (例如 docs: update readme)
style(scope): 代码格式、标点等不影响逻辑的更改
refactor(scope): 代码重构
test(scope): 添加缺失的测试
chore(scope): 构建过程、辅助工具变动