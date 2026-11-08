# affectUI Design System & Component Specification

本文档提炼自仓库现有的全部组件（`components/`、`blocks/`、`motion/`、`illustrations/`），旨在将仓库中隐含的设计系统（Implicit Design System）显性化、标准化。后续新增任何组件时，均应遵循本文档，保持视觉与交互、代码结构与无障碍体验的高度一致。

---

## 1. 核心架构哲学（Core Philosophy）

1. **单文件自包含（Single-File Self-Contained）**
   - 每个组件必须是一个独立的 `.tsx` 文件，**不依赖任何外部样式表、Tailwind 或 CSS Modules，也不依赖图标库或动画库**。
   - 组件之间**互不引用**（例如复杂卡片内部的按钮、徽标与加载器均在该文件内独立实现），确保任意单个文件被复制或通过 `shadcn` CLI 安装到目标项目时零依赖运行。
2. **React 19 样式提升（Style Hoisting）**
   - 所有样式定义在文件底部的 `const css = /* css */ \`...\`;` 模板字符串中。
   - 在组件 JSX 顶层通过 React 19 原生 `<style href="ui-<name>" precedence="default">{css}</style>` 注入，React 会自动去重并提升至 `<head>`。
3. **双视觉风格体系（Dual Visual Styles）**
   - `components/` 与 `blocks/` 下的每个组件均成对提供两个版本：
     - **Classic（默认，`*.tsx`）**：微质感风格，采用双层托盘（Tray + Card）与实色/渐变填充，以及 1px 实体边框和柔和投影。
     - **Clean（极简，`*-clean.tsx`）**：现代高密度桌面端风格，采用单层卡片、`0.5px` 极细阴影描边（Hairline Shadow）、RGBA 半透明灰阶与触屏自适应尺寸。
   - **相同的 Props 接口**：同一个组件的 Classic 与 Clean 版本必须导出**完全相同的组件名与 TypeScript Props 类型**，以便使用者可以零成本切换引用路径。

---

## 2. 命名与作用域规范（Naming & Scoping）

每个组件使用独立的短缩写（通常为组件单词首字母）作为 CSS 类名与 CSS 变量命名空间，避免全局样式污染：

| 维度 | Classic 规范 | Clean 规范 | 示例（以 `ChangeSummary` 为例） |
| :--- | :--- | :--- | :--- |
| **文件名** | `<kebab-name>.tsx` | `<kebab-name>-clean.tsx` | `change-summary.tsx` / `change-summary-clean.tsx` |
| **`<style href>`** | `ui-<kebab-name>` | `ui-<kebab-name>-clean` | `ui-change-summary` / `ui-change-summary-clean` |
| **根类名（Root Class）** | `.ui-<abbr>` | `.ui-<abbr>c` | `.ui-cs` / `.ui-csc` |
| **子元素类名（BEM）** | `.ui-<abbr>__<part>` | `.ui-<abbr>c__<part>` | `.ui-cs__row` / `.ui-csc__row` |
| **CSS 变量前缀** | `--ui-<abbr>-<token>` | `--ui-<abbr>c-<token>` | `--ui-cs-ink` / `--ui-csc-ink` |
| **Keyframes 命名** | `ui-<abbr>-<anim>` | `ui-<abbr>c-<anim>` | `ui-cs-in` / `ui-csc-in` |
| **状态修饰（State）** | `data-*` 属性选择器 | `data-*` 属性选择器 | `data-variant="primary"`、`data-open`、`data-tone="good"` |

> **注意**：尽量使用 `data-*` 属性（如 `data-size="sm"`、`data-loading`、`data-active`）而非拼接多个修飾类名来控制组件状态。

---

## 3. 双风格视觉对比（Classic vs. Clean）

| 视觉维度 | Classic 风格 (`*.tsx`) | Clean 风格 (`*-clean.tsx`) |
| :--- | :--- | :--- |
| **容器结构** | 常采用 **Tray + Card 双层结构**：外层浅灰托盘（`#f0f0f0`，`padding: 6px`，`border-radius: 22px`）包裹内层白卡（`#ffffff`，`border-radius: 16px`） | **单层扁平卡片**：无外层 Tray，直接渲染单张卡片（`#ffffff`，`border-radius: 10px`） |
| **边框与分割线** | `1px solid #e5e5e5`（或 `#f0f0f0`）实体边框 | **以阴影代边框**：卡片外框使用 `0.5px` 扩散阴影（`0 0 0 0.5px rgba(0,0,0,0.06)`），内部分割线使用 `0.5px solid rgba(0,0,0,0.06)` |
| **主按钮质感** | 顶部到底部微渐变（`#323137` → `#201e25`）+ `border-box` 高光描边 + `1px` 外环（`#0d0d0d`） | 纯色深色块（`rgba(0, 0, 0, 0.88)`），无边框、无渐变 |
| **色彩体系** | 以实色 Hex 为主（`#171717`、`#404040`、`#737373`、`#e5e5e5`） | 以半透明 Alpha 黑/白为主（`rgba(0,0,0,0.88)`、`0.61`、`0.45`、`0.06`），能自然融入任意底色 |
| **基准字号** | `14px`（次要信息 `13px` / `12.5px`） | `13px`（次要信息 `12px`），信息密度更高 |
| **控件高度** | 舒展：按钮 `sm: 32px` / `md: 40px` / `lg: 48px`，列表行高 `52px` | 紧凑：按钮 `sm: 24px` / `md: 28px` / `lg: 32px`（触屏 `@media (pointer: coarse)` 下自动增高至 `32/34/36px`），列表行高 `48px` |
| **圆角尺度** | 偏圆润：按钮 `10px / 12px / 14px`，内卡片 `14px–16px`，外托盘 `20px–22px` | 偏克制：按钮 `6px`，小标签 `5px`，卡片 `10px–12px` |
| **图标描边** | `strokeWidth="1.5"` ~ `"1.75"` | 极细线条：`strokeWidth="1.1"` ~ `"1.25"`，`strokeLinecap="round"` |

---

## 4. 色彩与表面 Token 标准（Color & Surface Tokens）

虽然每个组件的 CSS 变量带有各自的前缀（`--ui-<abbr>-*`），但全仓库遵循统一的**语义后缀与标准色值**。新组件定义这些 CSS 变量时应直接从下表取值：

### 4.1 Classic 风格标准色板

| 语义后缀 | 用途说明 | Light 模式标准值 | Dark 模式标准值 (`:where(.dark, [data-theme="dark"])`) |
| :--- | :--- | :--- | :--- |
| `tray` / `well` | 外层托盘 / 凹槽底色 | `#f0f0f0`（或 `#f4f4f5`） | `#161618`（或 `#111113`） |
| `card` / `surface` | 卡片 / 浮层表面背景 | `#ffffff` | `#232326`（深层卡片可用 `#19191b`） |
| `surface-hover` / `row-hover` | 表面悬停态 | `#fafafa` 或 `#f5f5f5` | `#2a2a2d` 或 `rgba(255, 255, 255, 0.05)` |
| `chip` / `tile` | 小块填充 / 图标底块 | `#f5f5f5`（悬停 `#ebebeb`） | `#2a2a2d`（悬停 `#313135`） |
| `line` / `border` | 边框与分割线 | `#e5e5e5`（浅分割线 `#f0f0f0`） | `rgba(255, 255, 255, 0.08)` ~ `0.1` |
| `ink` | 主标题与核心正文 | `#171717` | `#ededed` |
| `text` | 普通正文 | `#404040` | `#c4c4c4` |
| `muted` | 次要说明文字 / 图标 | `#737373` 或 `#8f8f8f` | `#8f8f8f` 或 `#8b8b92` |
| `faint` | 占位符 / 禁用辅助线 | `#b5b5b5` | `#6b6b70` |
| `accent` | 品牌强调色（AI / 激活态） | `#2f6bff` | `#6b95ff` |
| `accent-bg` / `accent-soft` | 强调色浅底 | `rgba(47, 107, 255, 0.1)` | `rgba(79, 130, 255, 0.16)` |
| `ok` / `success` | 成功 / 正向状态色 | `#1f8a4c`（或 `#18794e`） | `#3fbf74`（或 `#4cc38a`） |
| `ok-bg` | 成功状态浅底 | `#edfaf3` 或 `rgba(34, 160, 90, 0.11)` | `rgba(110, 231, 168, 0.12)` |
| `warn` / `alert` | 警告 / 进行中状态色 | `#c2570c`（或 `#e8590c`） | `#fb9a4b`（或 `#fb8a3c`） |
| `warn-bg` | 警告状态浅底 | `#fdeedd` | `rgba(251, 154, 75, 0.14)` |
| `danger` / `red` | 危险 / 错误 / 删除状态 | `#e5484d`（强警示 `#ff0000`） | `#ff6b6b` 或 `#ff6369` |
| `danger-bg` | 危险状态浅底 | `#ffe6e9` 或 `#fff0f0` | `rgba(255, 64, 64, 0.16)` |
| `shadow` | 卡片标准阴影 | `0 1px 2px rgba(0, 0, 0, 0.06)` | `0 1px 2px rgba(0, 0, 0, 0.4)` |
| `focus` | 键盘焦点外环 | `#2f6bff` 或 `rgba(23, 23, 23, 0.22)` | `#6b95ff` 或 `rgba(237, 237, 237, 0.3)` |

### 4.2 Clean 风格标准色板

| 语义后缀 | 用途说明 | Light 模式标准值 | Dark 模式标准值 (`:where(.dark, [data-theme="dark"])`) |
| :--- | :--- | :--- | :--- |
| `card` / `surface` | 卡片 / 按钮表面 | `#ffffff` | `#1c1c1e`（悬浮菜单可用 `#2c2c2f`） |
| `wash` | 列表行微弱悬停底色 | `rgba(0, 0, 0, 0.015)` ~ `0.03` | `rgba(255, 255, 255, 0.025)` ~ `0.04` |
| `fill` / `track` | 浅灰填充块 / 轨道底色 | `rgba(0, 0, 0, 0.04)` ~ `0.06` | `rgba(255, 255, 255, 0.08)` |
| `line` | `0.5px` 内部极细分割线 | `rgba(0, 0, 0, 0.06)` | `rgba(255, 255, 255, 0.08)` ~ `0.1` |
| `strong` / `title` | 强标题色 | `#000000` | `#ffffff` 或 `rgba(255, 255, 255, 0.9)` |
| `ink` | 主正文与主操作色 | `rgba(0, 0, 0, 0.88)` | `rgba(255, 255, 255, 0.9)` |
| `text` | 次级正文 | `rgba(0, 0, 0, 0.61)` | `rgba(255, 255, 255, 0.62)` |
| `muted` | 辅助标签 / 时间戳 | `rgba(0, 0, 0, 0.45)` | `rgba(255, 255, 255, 0.46)` |
| `icon` | 默认图标颜色 | `rgba(0, 0, 0, 0.447)` | `rgba(255, 255, 255, 0.5)` |
| `faint` | 禁用 / 弱化元素 | `rgba(0, 0, 0, 0.27)` | `rgba(255, 255, 255, 0.3)` |
| `solid` / `primary` | 主实心块背景 | `rgba(0, 0, 0, 0.88)`（悬停 `0.8`） | `rgba(255, 255, 255, 0.9)`（悬停 `0.82`） |
| `on-solid` | 主实心块上的文字 | `#fcfcfc` | `#161618` 或 `#1c1c1e` |
| `accent` | 品牌强调色（蓝） | `rgba(0, 96, 226, 0.765)`（或 `#0060e2`） | `#4d8dff` |
| `accent-soft` / `accent-bg` | 强调色浅底 | `rgba(0, 96, 226, 0.08)`（或 `0.05`） | `rgba(77, 141, 255, 0.14)` |
| `good` / `ok` | 成功 / 正向状态色 | `#1a9a52` | `#3ec27a` |
| `good-fill` / `ok-bg` | 成功状态浅底 | `rgba(26, 154, 82, 0.08)` | `rgba(62, 194, 122, 0.14)` |
| `warn` / `alert` | 警告状态色 | `#e8a20c`（文字 `#b47a06`） | `#f0b232` |
| `warn-bg` | 警告状态浅底 | `rgba(232, 162, 12, 0.12)` | `rgba(232, 162, 12, 0.14)` |
| `danger` / `bad` | 危险 / 错误状态色 | `#e5484d` | `#ff6369`（或 `#f2777b`） |
| `danger-bg` / `bad-fill` | 危险状态浅底 | `rgba(229, 72, 77, 0.08)` | `rgba(229, 72, 77, 0.14)` |
| `shadow` | Hairline 卡片阴影 | `0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)` | `0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.4)` |
| `shadow-pop` | 弹出层 / 下拉菜单阴影 | `0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 12px 28px -10px rgba(0, 0, 0, 0.16), 0 1px 2px 0 rgba(0, 0, 0, 0.05)` | `0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 12px 28px -10px rgba(0, 0, 0, 0.6)` |
| `focus` | 键盘焦点外环 | `rgba(0, 96, 226, 0.35)` | `rgba(77, 141, 255, 0.5)` |

### 4.3 代码高亮配色（JSON / Tool Call 参数展示）
当组件需要展示 JSON、参数或代码片段（如 `ToolCallCard`）时，使用统一的语法高亮 Token：
- **Key（键名）**：Classic `#171717` / Clean `rgba(0, 0, 0, 0.88)`（Dark: `#ededed` / `rgba(255, 255, 255, 0.9)`）
- **String（字符串 `--*-str`）**：Classic `#0f7b6c` / Clean `rgba(0, 123, 172, 0.9)`（Dark: `#4cc38a` / `#58c4dc`）
- **Number（数字 `--*-num`）**：`#b25b0c`（Dark: `#f0a45d`）
- **Boolean / Null（字面量 `--*-lit`）**：Classic `#6e56cf` / Clean `#5b5bd6`（Dark: `#b49cff` / `#9d9dff`）

---

## 5. 排版与字体规范（Typography）

1. **无衬线字体栈（Sans-serif）**
   - Classic：`"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
   - Clean：`"Inter", "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
2. **等宽字体栈（Monospace，用于函数名与工具调用名，以及耗时、Token 数和代码）**
   - `ui-monospace, "SF Mono", Menlo, monospace`
3. **数字排版（Tabular Numbers）**
   - 所有实时计时器、百分比与金额，以及进度数字和列表计数，必须声明 `font-variant-numeric: tabular-nums;`，防止数值跳动引起布局抖动。
4. **字重与平滑**
   - 仅使用三个字重：`400` 用于正文，`500` 用于标题、按钮与标签，`600` 用于强徽标或关键统计值。
   - 根容器始终开启 `-webkit-font-smoothing: antialiased;`。
5. **文本截断与悬停回显**
   - 单行截断使用 `min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`。
   - 截断文本推荐配合 `onPointerEnter` 检测 `el.scrollWidth > el.clientWidth + 1` 动态设置原生 `title`，保证被截断的内容在悬停时可读。
   - 多行文本支持双向语言排布（`dir="auto"`）及安全断词（`overflow-wrap: anywhere`）。

---

## 6. 布局与响应式规范（Layout & Container Queries）

1. **盒模型隔离**
   - 每个组件根选择器必须包含：
     ```css
     .ui-xxx, .ui-xxx *, .ui-xxx *::before, .ui-xxx *::after {
       box-sizing: border-box;
     }
     ```
2. **使用 Container Queries 而非 Media Queries**
   - 组件会被放置在侧边栏与弹窗，或聊天流、主画布等不同宽度的容器中。因此**禁止使用 `@media (max-width: ...)` 做布局折行**。
   - 在组件根元素声明 `container-type: inline-size;`，并使用 `@container (max-width: ...)` 进行自适应排版（常见断点：`420px`、`400px`、`360px`、`320px`）。
3. **触屏设备适配（Coarse Pointer）**
   - Clean 风格默认尺寸紧凑（24px–28px），必须通过 `@media (pointer: coarse)` 为移动端/触屏设备放大可点击区域高度（如按钮增至 `32px–36px`，行高增至 `52px`）。

---

## 7. 动效与微交互规范（Motion & Micro-interactions）

1. **标准缓动曲线（Easing Tokens）**
   - **主缓动（`--*-ease`）**：`cubic-bezier(0.22, 1, 0.36, 1)`（用于展开与折叠，以及位移、淡入和缩放）。
   - **Morph 缓动**：`cubic-bezier(0.25, 1, 0.5, 1)`（用于宽度/高度 FLIP 动态过渡、标签切换模糊入场）。
   - **弹性微动（`--*-pop` / `--*-spring`）**：`cubic-bezier(0.34, 1.56, 0.64, 1)`（用于点赞、勾选图标完成时的轻弹效果）。
2. **核心微交互模式**
   - **按压反馈**：所有可点击按钮在激活态添加 `:active:not(:disabled) { transform: scale(0.97); }`。
   - **内容切换 Morph（模糊淡入 + 宽度平滑过渡）**：
     - 按钮文案或状态标签发生变化后，利用 `useLayoutEffect` 记录上一次 `getBoundingClientRect().width` 并通过 Web Animations API `el.animate([{ width: from }, { width: to }], { duration: 480, easing: "cubic-bezier(0.25, 1, 0.5, 1)" })` 平滑过渡宽度。
     - 内部文字/图标通过改变 React `key` 触发重挂载，播放 `blur(3px) + translateY(25%) → 0` 的入场动画（首屏挂载通过 `data-ready` 避免初始闪烁）。
   - **高度折叠动画**：使用 `grid-template-rows: 0fr` → `1fr` 配合内部 `overflow: hidden` 实现平滑展开/收起，或使用 Web Animations API 测量真实高度。
   - **Shimmer 扫光加载态**：利用伪元素 `::after` 复制 `content: attr(data-text) / ""` 并配合 `-webkit-background-clip: text` 实现文字表面的高光扫过效果。
3. **强制支持减弱动态效果（Reduced Motion）**
   - **每一个组件**都必须包含 `@media (prefers-reduced-motion: reduce)` 规则，将 `animation` 设为 `none`、将 `transition-duration` 缩短为 `1ms` 或 `none`，并在 JS `el.animate` 调用前检查 `window.matchMedia("(prefers-reduced-motion: reduce)").matches`。

---

## 8. 无障碍与健壮性规范（Accessibility & Resilience）

1. **语义化 HTML 与键盘导航**
   - 交互触发器必须使用原生 `<button type="button">`，禁止在 `<div>` / `<span>` 上直接绑定 `onClick` 充当按钮。
   - 复合组件（如分段控制器 `SegmentedControl`、过滤菜单 `FilterMenu`、验证码输入 `OTPInput`）必须支持完整的方向键（`ArrowLeft` / `ArrowRight` / `ArrowUp` / `ArrowDown`）、`Home` / `End` 及 `Escape` 键盘控制。
   - 焦点样式统一使用 `:focus-visible { outline: 2px solid var(--ui-xxx-focus); outline-offset: 2px; }`。
2. **ARIA 状态同步**
   - 展开/收起面板必须关联 `aria-expanded={open}` 与 `aria-controls={panelId}`（使用 `useId()` 生成唯一 ID）。
   - 异步加载或状态变更区域合理使用 `aria-busy`、`aria-live="polite"`。
   - 装饰性 SVG 图标必须声明 `aria-hidden="true"`。
3. **防御性渲染（Defensive Rendering）**
   - **外部图片容错**：所有允许传入自定义图标或头像的槽位，需绑定 `onErrorCapture` 隐藏加载失败的 `<img>`（`event.target.style.visibility = "hidden"`）或回退到首字母缩写（Initials），绝不向用户暴露破碎图片图标。
   - **非法枚举兜底**：对传入的 `variant`、`size`、`status` 等枚举值做运行时白名单校验（如 `VARIANTS.includes(variant) ? variant : "primary"`），传入未知值时平稳回退到默认样式。
   - **受控与非受控双模式**：凡涉及内部状态的组件（如 `open`、`value`、`selected`），统一同时提供 `defaultXxx`（非受控）与 `xxx` + `onXxxChange`（受控）Props。

---

## 9. 新组件开发标准模板（Component Boilerplate）

新增组件时，请创建 `<name>.tsx` 与 `<name>-clean.tsx`，并遵循以下代码骨架：

```tsx
"use client";

import {
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

/*
 * Component Name – one-line summary in a single self-contained file.
 * Brief description of visual layout, states, and interactions.
 * The styles are injected below, so no extra files are needed.
 */

export type ExampleWidgetProps = ComponentPropsWithoutRef<"div"> & {
  /** Primary title shown in the header */
  title: string;
  /** Current state of the widget */
  status?: "idle" | "running" | "done";
  /** Controlled open state */
  open?: boolean;
  /** Uncontrolled initial open state */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  icon?: ReactNode;
};

export function ExampleWidget({
  title,
  status = "idle",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  icon,
  className,
  ...rest
}: ExampleWidgetProps) {
  const id = useId();
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
  };

  return (
    <>
      <style href="ui-example-widget" precedence="default">
        {css}
      </style>
      <div
        className={["ui-ew", className].filter(Boolean).join(" ")}
        data-status={status}
        data-open={open || undefined}
        {...rest}
      >
        {/* Component markup */}
      </div>
    </>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
/* Colors and motion as variables – override them on .ui-ew */
.ui-ew {
  --ui-ew-tray: #f0f0f0;
  --ui-ew-card: #ffffff;
  --ui-ew-line: #e5e5e5;
  --ui-ew-ink: #171717;
  --ui-ew-muted: #737373;
  --ui-ew-accent: #2f6bff;
  --ui-ew-ease: cubic-bezier(0.22, 1, 0.36, 1);

  box-sizing: border-box;
  width: 100%;
  container-type: inline-size;
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--ui-ew-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-ew *, .ui-ew *::before, .ui-ew *::after {
  box-sizing: border-box;
}

@container (max-width: 400px) {
  /* Responsive adjustments for narrow containers */
}

@media (prefers-reduced-motion: reduce) {
  .ui-ew, .ui-ew * {
    animation: none !important;
    transition-duration: 1ms !important;
  }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-ew {
  --ui-ew-tray: #161618;
  --ui-ew-card: #232326;
  --ui-ew-line: rgba(255, 255, 255, 0.08);
  --ui-ew-ink: #ededed;
  --ui-ew-muted: #8f8f8f;
  --ui-ew-accent: #6b95ff;
}
`;
```

---

## 10. 现有组件命名空间速查表（Prefix Registry）

在新增组件选择缩写前缀（`--ui-<abbr>-`）时，请避开以下已使用的缩写：

| 组件名称 | Classic 文件 (`root` / `prefix`) | Clean 文件 (`root` / `prefix`) |
| :--- | :--- | :--- |
| **Button** | `button.tsx` (`.ui-button` / `--ui-btn-`) | `button-clean.tsx` (`.ui-buttonc` / `--ui-btnc-`) |
| **Change Summary** | `change-summary.tsx` (`.ui-cs` / `--ui-cs-`) | `change-summary-clean.tsx` (`.ui-csc` / `--ui-csc-`) |
| **Comment Thread** | `comment-thread.tsx` (`.ui-ct` / `--ui-ct-`) | `comment-thread-clean.tsx` (`.ui-ctc` / `--ui-ctc-`) |
| **Decision Inbox** | `decision-inbox.tsx` (`.ui-di` / `--ui-di-`) | `decision-inbox-clean.tsx` (`.ui-dic` / `--ui-dic-`) |
| **Email Draft** | `email-draft.tsx` (`.ui-ed` / `--ui-ed-`) | `email-draft-clean.tsx` (`.ui-edc` / `--ui-edc-`) |
| **Filter Menu** | `filter-menu.tsx` (`.ui-fm` / `--ui-fm-`) | `filter-menu-clean.tsx` (`.ui-fmc` / `--ui-fmc-`) |
| **Message Actions** | `message-actions.tsx` (`.ui-ma` / `--ui-ma-`) | `message-actions-clean.tsx` (`.ui-mac` / `--ui-mac-`) |
| **Notification Stack** | `notification-stack.tsx` (`.ui-ns` / `--ui-ns-`) | `notification-stack-clean.tsx` (`.ui-nsc` / `--ui-nsc-`) |
| **OTP Input** | `otp-input.tsx` (`.ui-otp` / `--ui-otp-`) | `otp-input-clean.tsx` (`.ui-otpc` / `--ui-otpc-`) |
| **Profile Menu** | `profile-menu.tsx` (`.ui-pm` / `--ui-pm-`) | `profile-menu-clean.tsx` (`.ui-pmc` / `--ui-pmc-`) |
| **Progress Tracker** | `progress-tracker.tsx` (`.ui-progress` / `--ui-pg-`) | `progress-tracker-clean.tsx` (`.ui-progressc` / `--ui-pgc-`) |
| **Reaction Bar** | `reaction-bar.tsx` (`.ui-rb` / `--ui-rb-`) | `reaction-bar-clean.tsx` (`.ui-rbc` / `--ui-rbc-`) |
| **Segmented Control** | `segmented-control.tsx` (`.ui-seg` / `--ui-seg-`) | `segmented-control-clean.tsx` (`.ui-segc` / `--ui-segc-`) |
| **Smart Recommendation** | `smart-recommendation.tsx` (`.ui-sr` / `--ui-sr-`) | `smart-recommendation-clean.tsx` (`.ui-src` / `--ui-src-`) |
| **Thinking Loader** | `thinking-loader.tsx` (`.ui-tl` / `--ui-tl-`) | `thinking-loader-clean.tsx` (`.ui-tlc` / `--ui-tlc-`) |
| **Tips Panel** | `tips-panel.tsx` (`.ui-tp` / `--ui-tp-`) | `tips-panel-clean.tsx` (`.ui-tpc` / `--ui-tpc-`) |
| **Tool Call Card** | `tool-call-card.tsx` (`.ui-tc` / `--ui-tc-`) | `tool-call-card-clean.tsx` (`.ui-tcc` / `--ui-tcc-`) |
| **Logo Marquee** | `logo-marquee.tsx` (`.ui-lm` / `--ui-lm-`) | `logo-marquee-clean.tsx` (`.ui-lmc` / `--ui-lmc-`) |
| **Testimonial Wall** | `testimonial-wall.tsx` (`.ui-tw` / `--ui-tw-`) | `testimonial-wall-clean.tsx` (`.ui-twc` / `--ui-twc-`) |
| **Motion (4)** | `.ui-gb` (`--ui-gb-`), `.ui-nt` (`--ui-nt-`), `.ui-shm` (`--ui-shm-`), `.ui-trv` (`--ui-trv-`) | — |
| **Illustrations (17)** | `.ui-at`, `.ui-cf`, `.ui-ec`, `.ui-eo`, `.ui-fc`, `.ui-gc`, `.ui-ib`, `.ui-ig`, `.ui-lyr`, `.ui-ls`, `.ui-lc`, `.ui-mw`, `.ui-rd`, `.ui-sf`, `.ui-to`, `.ui-ti` | — |
