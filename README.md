# 高级计算器 Advanced Calculator

一款功能强大的科学计算器应用，支持多种计算模式和3D可视化。

## 功能特性

### 基础计算
- 四则运算
- 百分比计算
- 正负号切换

### 科学计算
- 三角函数 (sin, cos, tan)
- 对数函数 (ln, log)
- 指数和幂运算
- 阶乘计算
- 角度/弧度切换

### 绘图功能
- 2D函数图像绘制
- 缩放和平移控制
- 坐标轴显示

### 方程求解
- 一元一次方程
- 一元二次方程
- 二元一次方程组

### 矩阵运算
- 矩阵加法、减法、乘法
- 行列式计算
- 逆矩阵

### 几何计算
- 圆、三角形、矩形、椭圆
- 梯形、正多边形
- 球体、圆柱体、圆锥体、圆环体
- 图形可视化

### 3D可视化 (Three.js)
- 3D曲面绘制
- 向量运算
- 两点距离计算
- 平面方程可视化
- 直线方程可视化
- 参数曲线绘制

### 微积分
- 导数计算
- 积分计算
- 极限计算
- 级数求和
- 泰勒展开

### 概率统计
- 组合与排列
- 描述统计
- 二项分布、正态分布、泊松分布

### 数论
- 素数检测
- 素因数分解
- GCD/LCM计算
- 模幂运算
- 欧拉函数
- 斐波那契数列

### 代数运算
- 三次方程求解
- 多项式运算
- 集合运算
- 逻辑运算
- 数列求和

### 应用数学
- 牛顿法求根
- 线性回归
- 拉格朗日插值
- 数值积分
- 微分方程求解

### 趣味计算
- 亲戚关系计算
- 房贷车贷计算
- 年化收益率
- 汇率转换
- 大写数字转换
- 进制转换
- 速度计算
- BMI计算
- 个税计算

### 单位转换
- 长度、重量、温度
- 面积、体积、时间
- 速度、数据存储

## 技术栈

- **前端**: HTML5, CSS3, JavaScript
- **3D渲染**: Three.js
- **桌面应用**: Electron
- **移动应用**: Android WebView

## 安装与使用

### 桌面版 (Electron)
```bash
cd electron-calculator
npm install
npm start
```

### 构建Windows可执行文件
```bash
cd electron-calculator
npm run build:win
```

### 构建Android APK
```bash
cd android-apk
gradlew assembleDebug
```

## 项目结构

```
├── electron-calculator/     # Electron桌面应用
│   ├── index.html          # 主界面
│   ├── app.js              # 核心逻辑
│   ├── main.js             # Electron主进程
│   └── package.json        # 依赖配置
├── android-apk/            # Android应用
│   └── app/src/main/assets/# Web资源
├── calculator/             # 基础版本
├── advanced_calculator/    # Flutter版本(实验性)
└── README.md               # 项目说明
```

## 更新日志

### v2.0.0 (2026-06-06)
- 新增3D可视化功能 (Three.js)
- 修复3D面板子标签点击问题
- 优化CSS堆叠层级
- 改进事件委托机制

### v1.5.0
- 新增微积分模块
- 新增概率统计模块
- 新增数论模块

### v1.0.0
- 初始版本发布
- 基础计算和科学计算
- 绘图功能
- 方程求解

## 许可证

MIT License

## 作者

ATboy-web

## 贡献

欢迎提交Issue和Pull Request！
