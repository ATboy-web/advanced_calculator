# 模块化迁移指南

> 本文档指导团队如何将原始的 2718 行 `app.js` 逐步迁移到新的模块化架构。

## 已完成的工作

### ✅ 安全加固
- `main.js` → `contextIsolation: true` + `preload.js` 桥接
- `nodeIntegration: false` + `sandbox: true`

### ✅ 代码质量工具链
- ESLint (`.eslintrc.json`) — 禁止 `var`、强制 `===`、禁止 `eval()`
- Prettier (`.prettierrc`) — 统一代码格式
- Vitest (`vitest.config.js`) — 单元测试框架

### ✅ 模块化基础设施（`src/js/`）

```
src/js/
├── core/event-bus.js      ← 发布/订阅事件总线
├── state/store.js         ← 响应式状态管理
├── utils/
│   ├── format.js          ← 数值格式化（fmt、convertToChinese）
│   ├── math.js            ← 纯数学函数（fact、gcd、isPrime、solveCubic 等 20+ 个）
│   └── dom.js             ← DOM 工具（$、debounce、getInputValue 等）
├── ui/
│   ├── theme.js           ← 主题管理器（light/dark/system）
│   ├── tabs.js            ← 标签页管理（事件委托替代 onclick）
│   └── keyboard.js        ← 键盘快捷键
├── modules/               ← 待迁移的计算模块目录
└── app.js                 ← 待创建的模块化入口
```

### ✅ CSS 变量系统
- `src/styles/variables.css` — 颜色、间距、字体、动画 Token

### ✅ 测试
- `tests/unit/math-utils.test.js` — 数学工具 40+ 测试用例
- `tests/unit/format.test.js` — 格式化函数测试
- `tests/unit/event-bus.test.js` — EventBus 9 个测试用例
- `tests/unit/store.test.js` — Store 7 个测试用例

### ✅ CI 增强
- ESLint + Prettier + Vitest + 安全检查集成

---

## 迁移步骤（按优先级）

### 第 1 步：安装依赖并验证

```bash
cd electron-calculator
npm install
npm run lint          # 查看当前代码的 ESLint 错误
npm run test          # 运行新编写的测试
npm run format        # 自动格式化所有文件
```

### 第 2 步：从 app.js 提取数学函数

原始 `app.js` 中的以下函数已经迁移到 `src/js/utils/math.js`：

| 原始函数 | 新位置 | 说明 |
|----------|--------|------|
| `fact()` | `math.js` | 阶乘 |
| `fmt()` | `format.js` | 数值格式化 |
| `buildMathFunc()` | `math.js` | 表达式解析 |
| `evalFunc()` | `math.js` | 绘图用函数解析 |
| `erf()` | `math.js` | 误差函数 |
| `numericalDerivative()` | `math.js` | 数值导数 |
| `numericalDerivativeN()` | `math.js` | 高阶导数 |
| `simpsonIntegral()` | `math.js` | 辛普森积分 |
| `trapezoidIntegral()` | `math.js` | 梯形积分 |
| `isPrime()` | `math.js` | 素数检测 |
| `primeFactors()` | `math.js` | 素因数分解 |
| `gcd()` / `lcm()` | `math.js` | 最大公约数/最小公倍数 |
| `eulerPhi()` | `math.js` | 欧拉函数 |
| `modpow()` | `math.js` | 模幂运算 |
| `fibonacci()` | `math.js` | 斐波那契 |
| `horner()` | `math.js` | Horner 法 |
| `solveCubic()` | `math.js` | 三次方程 |
| `perm()` / `comb()` | `math.js` | 排列组合 |
| `binPMF()` / `normCDF()` / `poisPMF()` | `math.js` | 概率分布 |
| `convertToChinese()` | `format.js` | 大写数字 |

**迁移方式**：在 app.js 顶部添加导入：

```javascript
// 在 app.js 顶部
import { fmt, fact, isPrime, gcd, ... } from './src/js/utils/math.js';
```

然后逐步删除 app.js 中的重复定义。

### 第 3 步：迁移计算模块

按以下顺序逐个迁移（从简单到复杂）：

1. **converter.js** — 单位转换（~130 行，逻辑独立）
2. **equation.js** — 方程求解（~30 行）
3. **matrix.js** — 矩阵运算（~100 行）
4. **number-theory.js** — 数论（~30 行，函数已提取）
5. **statistics.js** — 概率统计（~30 行）
6. **algebra.js** — 代数（~35 行）
7. **calculus.js** — 微积分（~50 行）
8. **applied.js** — 应用数学（~65 行）
9. **fun.js** — 趣味计算（~230 行）
10. **geometry.js** — 几何（~540 行，含大量绘图代码）
11. **three-d.js** — 3D 可视化（~500 行，含 Three.js 集成）
12. **graph.js** — 2D 绘图（~200 行）
13. **basic.js** — 基础计算（~145 行，calc 对象）
14. **scientific.js** — 科学计算（与 basic 共享 calc）

**每个模块的标准结构**：

```javascript
// src/js/modules/xxx.js
import { eventBus } from '../core/event-bus.js';
import { $, getInputValue, setResultHTML } from '../utils/dom.js';
import { fmt } from '../utils/format.js';

let moduleType = 'default';

export function setModuleType(type, btn) { ... }
export function updateModuleInputs() { ... }
export function calculateModule() { ... }
```

### 第 4 步：重构事件绑定

原始 HTML 中大量使用内联 `onclick`：

```html
<!-- 旧方式 -->
<button onclick="showPanel('basic')">基础</button>
<button onclick="calc.digit('1')">1</button>
```

改为事件委托 + `data-*` 属性：

```html
<!-- 新方式 -->
<button data-panel="basic">基础</button>
<button data-digit="1">1</button>
```

配合 `src/js/ui/tabs.js` 和新的事件系统。

### 第 5 步：集成主题系统

在 index.html 中引入 CSS 变量：

```html
<link rel="stylesheet" href="src/styles/variables.css">
```

将硬编码颜色替换为 CSS 变量：

```css
/* 旧 */
body { background: #1a1a2e; }

/* 新 */
body { background: var(--color-bg-primary); }
```

---

## 运行测试

```bash
npm run test              # 一次性运行
npm run test:watch        # 监听模式
npm run test:coverage     # 覆盖率报告
```

## 注意事项

1. **不要一次性改完** — 每次只迁移一个模块，测试通过后再继续
2. **保持向后兼容** — 迁移过程中旧的全局函数可以通过 `window.xxx = xxx` 临时保留
3. **先写测试再重构** — 为要迁移的函数先写测试，确认行为一致后再移动
4. **Three.js 是全局变量** — `THREE` 在 ESLint 中已配置为全局变量
