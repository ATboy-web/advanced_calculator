# 高级计算器 uTools 插件

基于高级计算器项目的完整功能uTools插件版本。

> **V1.0.0** — 首次发布，完整移植全部功能

**仓库地址：** https://github.com/ATboy-web/advanced_calculator

## 功能特性

### 基础计算
- 四则运算、百分比、正负切换
- 键盘快捷键支持

### 科学计算
- 三角函数 (sin/cos/tan 及其反函数)
- 对数函数 (ln/log)
- 指数/幂运算 (eˣ/10ˣ/x²/x³)
- 根号、绝对值、阶乘
- 取整函数 (⌈x⌉/⌊x⌋)
- 常数 π、e

### 方程求解
- 一元一次方程 (ax + b = 0)
- 一元二次方程 (ax² + bx + c = 0，支持复数解)
- 二元一次方程组 (Cramer法则)

### 矩阵运算
- 矩阵加法、减法、乘法 (2×2)
- 行列式计算 (3×3)
- 逆矩阵计算 (3×3)

### 几何计算 (10种图形)
- 2D: 圆、三角形、矩形、椭圆、梯形、正多边形
- 3D: 球体、圆柱体、圆锥体、圆环体

### 概率统计
- 组合数 C(n,r)、排列数 P(n,r)
- 描述统计 (均值、中位数、方差、标准差)
- 二项分布、正态分布、泊松分布

### 数论
- 素数检测、素因数分解
- GCD/LCM、模幂运算
- 欧拉函数 φ(n)、斐波那契数列

### 单位转换 (8大类)
- 长度、重量、温度、面积、体积、数据、速度、进制

### 趣味工具 (8种)
- 房贷车贷计算 (等额本息/等额本金)
- 年化收益计算 (复利)
- 汇率转换 (8种货币)
- 中文大写数字转换
- 进制转换
- 速度单位转换
- BMI计算
- 个税计算 (中国大陆7级累进税率)

### 数学教程 (6大主题)
- 代数入门 (韦达定理、因式分解)
- 微积分基础 (导数定义、定积分)
- 几何入门 (勾股定理、圆的性质)
- 概率基础 (古典概型)
- 线性代数 (矩阵乘法)
- 三角函数 (基本恒等式)

### 多语言支持
- 中文 (简体)
- English
- हिन्दी (印地语)
- Español (西班牙语)

## 文件结构

```
calculator-plugin/
├── plugin.json        # 插件配置文件
├── preload.js         # uTools预加载脚本
├── index.html         # 主界面
├── logo.png           # 插件图标
├── README.md          # 说明文档
├── package.json       # npm配置
├── install.bat        # 安装脚本
└── js/                # JavaScript模块
    ├── i18n.js        # 多语言模块
    ├── calculator.js  # 计算引擎
    ├── equation.js    # 方程求解
    ├── matrix.js      # 矩阵运算
    ├── geometry.js    # 几何计算
    ├── statistics.js  # 概率统计
    ├── numbertheory.js# 数论
    ├── converter.js   # 单位转换
    ├── fun.js         # 趣味工具
    └── tutorial.js    # 数学教程
```

## 安装方法

1. 安装 [uTools](https://u.tools)
2. 安装 [uTools 开发者工具](https://www.u-tools.cn/docs/developer/basic/getting-started.html)
3. 打开 uTools 开发者工具
4. 点击"加载插件"按钮
5. 选择 `calculator-plugin` 文件夹

## 使用方法

1. 呼出 uTools (默认快捷键 `Alt+Space`)
2. 输入关键词启动对应功能：
   - `计算器` / `calculator` - 打开计算器
   - `方程` / `equation` - 方程求解
   - `矩阵` / `matrix` - 矩阵运算
   - `几何` / `geometry` - 几何计算
   - `概率` / `statistics` - 概率统计
   - `转换` / `converter` - 单位转换
   - `教程` / `tutorial` - 数学教程
3. 按回车键启动

## 键盘快捷键

- 数字键 0-9: 输入数字
- `+` `-` `*` `/`: 运算符
- `(` `)`: 括号
- `Enter`: 计算结果
- `Escape`: 清除
- `Backspace`: 退格

## 技术说明

- 纯前端实现，无需后端服务
- 模块化设计，便于维护和扩展
- 支持uTools插件API
- 所有计算在本地完成，无数据上传

## 开源协议

MIT License