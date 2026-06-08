# 高级计算器 Advanced Calculator

[![CI](https://github.com/ATboy-web/advanced_calculator/actions/workflows/ci.yml/badge.svg)](https://github.com/ATboy-web/advanced_calculator/actions/workflows/ci.yml)
[![Release](https://github.com/ATboy-web/advanced_calculator/actions/workflows/release.yml/badge.svg)](https://github.com/ATboy-web/advanced_calculator/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/ATboy-web/advanced_calculator/releases)

> 一款功能强大的跨平台科学计算器，支持 15+ 计算模块、3D 可视化、数学教程和多语言界面。

[English](#english) | [हिन्दी](#हिन्दी) | [Español](#español)

---

## 功能特性

### 计算模块 (15个)

| 模块 | 功能 | 亮点 |
|------|------|------|
| **基础计算** | 四则运算、百分比、正负号 | 标准计算器布局 |
| **科学计算** | 三角函数、对数、指数、阶乘 | DEG/RAD 切换 |
| **函数绘图** | 2D 函数图像绘制 | 滚轮缩放、拖拽平移 |
| **方程求解** | 一元一次/二次、二元一次方程组 | 显示求解过程 |
| **矩阵运算** | 加减乘、行列式、逆矩阵 | 可视化矩阵输入 |
| **几何计算** | 10种图形(圆/三角形/球体等) | Canvas 可视化 |
| **3D可视化** | 曲面、向量、平面、直线、参数曲线 | Three.js 交互式3D |
| **微积分** | 导数、积分、极限、级数、泰勒展开 | 数值+符号计算 |
| **概率统计** | 组合排列、描述统计、分布函数 | 二项/正态/泊松分布 |
| **数论** | 素数检测、因式分解、GCD/LCM、欧拉函数 | 模幂运算 |
| **代数运算** | 三次方程、多项式、集合、逻辑、数列 | 步骤展示 |
| **应用数学** | 牛顿法、线性回归、插值、数值积分、ODE | 迭代过程可视化 |
| **趣味计算** | 亲戚关系、房贷、汇率、BMI、个税等9种 | 生活实用工具 |
| **单位转换** | 长度/重量/温度/面积/体积/速度/数据 | 8大类单位 |
| **数学教程** | 代数/微积分/几何/概率/线性代数/三角函数 | 交互式学习 |

### 核心特性

- **多语言支持 (i18n)** - 中文 / English / हिन्दी / Español 四语切换
- **数学教程系统** - 基于 MathWorld 百科的交互式学习教程
- **3D 可视化** - Three.js 驱动的 3D 曲面和几何体渲染
- **改进的输入标签** - 每个输入框都有清晰的参数说明
- **深色主题** - 护眼的暗色 UI 设计
- **计算历史** - 自动保存计算记录

### 截图

| 基础计算 | 3D可视化 | 数学教程 |
|----------|----------|----------|
| ![基础](docs/screenshots/basic.png) | ![3D](docs/screenshots/3d.png) | ![教程](docs/screenshots/tutorial.png) |

---

## 安装与使用

### 桌面版 (Electron)

```bash
# 克隆仓库
git clone https://github.com/ATboy-web/advanced_calculator.git
cd advanced_calculator/electron-calculator

# 安装依赖
npm install

# 启动应用
npm start
```

### 构建可执行文件

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux

# 全平台
npm run build:all
```

### Android APK

```bash
cd android-apk
chmod +x gradlew
./gradlew assembleDebug
# APK 输出: app/build/outputs/apk/debug/app-debug.apk
```

### 快速启动 (Windows)

双击以下批处理文件:
- `启动高级计算器.bat` - 启动 Electron 桌面版
- `打包APK.bat` - 构建 Android APK
- `打开使用指南.bat` - 查看使用说明

---

## 项目结构

```
advanced_calculator/
├── electron-calculator/          # Electron 桌面应用 (主应用)
│   ├── index.html               # 主界面
│   ├── app.js                   # 核心逻辑 (~3500行)
│   ├── main.js                  # Electron 主进程
│   ├── preload.js               # 安全预加载脚本
│   ├── package.json             # 依赖配置
│   ├── src/                     # 模块化源码
│   │   ├── js/core/            # 核心模块
│   │   ├── js/state/           # 状态管理
│   │   ├── js/utils/           # 工具函数
│   │   ├── js/modules/         # 计算模块
│   │   └── js/ui/              # UI 组件
│   └── tests/                   # 单元测试
├── android-apk/                  # Android WebView 应用
│   └── app/src/main/assets/    # Web 资源
├── calculator/                   # 基础版本 (纯HTML)
├── advanced_calculator/          # Flutter 版本 (实验性)
├── AdvancedCalculator/           # C# WPF 版本 (实验性)
├── .github/                      # GitHub 配置
│   ├── workflows/              # CI/CD 工作流
│   ├── ISSUE_TEMPLATE/         # Issue 模板
│   └── PULL_REQUEST_TEMPLATE.md
├── README.md
├── CONTRIBUTING.md               # 贡献指南
├── CODE_OF_CONDUCT.md           # 行为准则
├── SECURITY.md                  # 安全政策
└── CHANGELOG.md                 # 更新日志
```

---

## 技术栈

| 技术 | 用途 |
|------|------|
| **HTML5 / CSS3** | 界面布局与样式 |
| **JavaScript (ES6+)** | 核心计算逻辑 |
| **Three.js** | 3D 可视化渲染 |
| **Electron** | 桌面应用打包 |
| **Android WebView** | 移动端应用 |
| **Vitest** | 单元测试框架 |
| **ESLint + Prettier** | 代码质量 |
| **GitHub Actions** | CI/CD 自动化 |

---

## 开发指南

### 环境要求

- Node.js >= 18
- npm >= 9
- (可选) Android Studio - 构建 APK

### 开发命令

```bash
npm start              # 启动开发模式
npm run lint           # 代码检查
npm run lint:fix       # 自动修复
npm run format         # 代码格式化
npm run format:check   # 格式检查
npm test               # 运行测试
npm run test:watch     # 监视模式
npm run test:coverage  # 覆盖率报告
npm run validate       # 完整验证 (lint + format + test)
```

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

---

## 更新日志

### v2.1.0 (2026-06-08)
- **数学教程系统** - 6大分类(代数/微积分/几何/概率/线性代数/三角函数)的交互式学习教程
- **多语言支持** - 中文/English/हिन्दी/Español 四语界面切换
- **输入标签优化** - 所有计算器面板添加参数说明，降低使用门槛
- **基于 MathWorld** - 教程内容参考 mathworld.net.cn 数学百科

### v2.0.0 (2026-06-06)
- 新增 3D 可视化功能 (Three.js)
- 修复 3D 面板子标签点击问题
- 优化 CSS 堆叠层级
- 改进事件委托机制

### v1.5.0
- 新增微积分模块
- 新增概率统计模块
- 新增数论模块
- 新增代数扩展模块
- 新增应用数学模块

### v1.0.0
- 初始版本发布
- 基础计算和科学计算
- 绘图功能
- 方程求解

---

## 贡献

欢迎贡献！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

1. Fork 本仓库
2. 创建特性分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m "feat: add amazing feature"`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

---

## 许可证

本项目基于 [MIT License](LICENSE) 开源。

---

## 作者

**ATboy-web** - [GitHub](https://github.com/ATboy-web)

---

## 致谢

- [MathWorld](https://mathworld.net.cn/) - 数学百科参考
- [Three.js](https://threejs.org/) - 3D 渲染引擎
- [Electron](https://www.electronjs.org/) - 桌面应用框架

---

<a name="english"></a>
## English

### Features
- **15 Calculator Modules** - Basic, Scientific, Graphing, Equation, Matrix, Geometry, 3D, Calculus, Statistics, Number Theory, Algebra, Applied Math, Fun, Converter, Tutorial
- **3D Visualization** - Interactive 3D surfaces with Three.js
- **Math Tutorials** - Learn algebra, calculus, geometry, probability, linear algebra, and trigonometry interactively
- **Multi-language** - Chinese, English, Hindi, Spanish interface
- **Cross-platform** - Electron (Windows/Mac/Linux) + Android APK

### Quick Start
```bash
git clone https://github.com/ATboy-web/advanced_calculator.git
cd advanced_calculator/electron-calculator
npm install && npm start
```

---

<a name="हिन्दी"></a>
## हिन्दी (Hindi)

### विशेषताएं
- **15 कैलकुलेटर मॉड्यूल** - बेसिक, वैज्ञानिक, ग्राफ़, समीकरण, मैट्रिक्स, ज्यामिति, 3D, कैलकुलस, सांख्यिकी, संख्या सिद्धांत, बीजगणित, अनुप्रयुक्त गणित, मज़ेदार, कनवर्टर, ट्यूटोरियल
- **3D विज़ुअलाइज़ेशन** - Three.js द्वारा इंटरैक्टिव 3D सतह
- **गणित ट्यूटोरियल** - बीजगणित, कैलकुलस, ज्यामिति, प्रायिकता, रैखिक बीजगणित, त्रिकोणमिति इंटरैक्टिव रूप से सीखें
- **बहुभाषी** - चीनी, अंग्रेजी, हिन्दी, स्पेनिश इंटरफ़ेस

### त्वरित शुरुआत
```bash
git clone https://github.com/ATboy-web/advanced_calculator.git
cd advanced_calculator/electron-calculator
npm install && npm start
```

---

<a name="español"></a>
## Español (Spanish)

### Características
- **15 Módulos de Cálculo** - Básico, Científico, Gráfico, Ecuación, Matriz, Geometría, 3D, Cálculo, Estadística, Teoría de Números, Álgebra, Matemáticas Aplicadas, Divertido, Convertidor, Tutorial
- **Visualización 3D** - Superficies 3D interactivas con Three.js
- **Tutoriales de Matemáticas** - Aprende álgebra, cálculo, geometría, probabilidad, álgebra lineal y trigonometría de forma interactiva
- **Multilingüe** - Interfaz en chino, inglés, hindi y español

### Inicio Rápido
```bash
git clone https://github.com/ATboy-web/advanced_calculator.git
cd advanced_calculator/electron-calculator
npm install && npm start
```
