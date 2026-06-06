# 高级计算器 - Electron版本

这是一个使用Electron框架构建的跨平台桌面计算器应用。

## 功能特点

- **基础计算**: 四则运算、百分比、正负切换
- **科学计算**: 三角函数、对数、指数、阶乘、幂运算
- **函数绘图**: 输入数学表达式绘制函数图像
- **方程求解**: 一元一次、一元二次、二元一次方程
- **矩阵计算器**: 矩阵加法、减法、乘法、行列式、逆矩阵
- **几何工具**: 圆、三角形、矩形、球体、圆柱体的面积、体积计算
- **3D计算器**: 向量运算、两点距离、平面方程、直线方程
- **微积分**: 导数、定积分、极限、级数求和、泰勒展开 (参考 MathWorld)
- **概率统计**: 排列组合、描述统计、二项分布、正态分布、泊松分布 (参考 MathWorld)
- **数论**: 素数检测、素因数分解、GCD/LCM、模幂运算、欧拉函数、斐波那契 (参考 MathWorld)
- **代数扩展**: 三次方程(Cardano公式)、多项式求值(霍纳法)、集合运算、逻辑运算、数列求和 (参考 MathWorld)
- **应用数学**: 牛顿迭代法、线性回归、拉格朗日插值、数值积分、龙格-库塔微分方程 (参考 MathWorld)
- **趣味计算**: 亲戚计算、房贷车贷、年化收益、汇率、大写数字、进制、速度、BMI、个人所得税
- **单位转换**: 长度、重量、温度、面积、体积、速度、数据、进制
- **计算历史**: 保存并复用历史计算结果

## 支持平台

- **Windows**: 生成 `.exe` 安装包
- **macOS**: 生成 `.dmg` 安装包
- **Linux**: 生成 `AppImage` 可执行文件

## 快速开始

### 方式一：浏览器直接运行（推荐先测试）

直接双击 `index.html` 文件即可在浏览器中使用计算器，无需安装任何依赖！

或运行：
```
test-in-browser.bat
```

### 方式二：Electron 桌面应用

#### 1. 安装 Electron

```
install-electron.bat
```

#### 2. 运行应用

```
run.bat
```

或手动：
```bash
cd electron-calculator
npm start
```

### 方式三：构建可执行文件

```bash
# 构建Windows版本
npm run build:win

# 构建macOS版本
npm run build:mac

# 构建Linux版本
npm run build:linux

# 构建所有平台版本
npm run build:all
```

## 构建输出

构建完成后，可执行文件将生成在 `dist` 目录中：

- **Windows**: `dist/高级计算器 Setup.exe`
- **macOS**: `dist/高级计算器.dmg`
- **Linux**: `dist/高级计算器.AppImage`

## 项目结构

```
electron-calculator/
├── main.js          # Electron主进程
├── index.html       # 应用界面
├── app.js           # 计算器逻辑
├── package.json     # 项目配置
├── icon.png         # 应用图标 (需要添加)
└── README.md        # 说明文档
```

## 开发说明

### 添加应用图标

1. 准备一个 `.png` 格式的图标文件（建议尺寸：256x256 或 512x512）
2. 将图标文件命名为 `icon.png` 并放在项目根目录
3. 重新构建应用

### 自定义应用信息

编辑 `package.json` 文件中的 `build` 部分：

```json
{
  "build": {
    "appId": "com.advanced.calculator",
    "productName": "高级计算器",
    "win": {
      "target": "nsis",
      "icon": "icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "icon.icns"
    },
    "linux": {
      "target": "AppImage",
      "icon": "icon.png"
    }
  }
}
```

## 故障排除

### 1. 程序卡死/无响应

**已修复！** 如果遇到此问题，请确保使用最新版本的 `app.js`。

修复内容：
- 修复了 `calculateFun()` 函数缺少闭合括号导致的语法错误
- 优化了级数计算性能（避免重复构建函数）

### 2. Electron 安装失败

运行 `install-electron.bat` 脚本，它会：
- 自动检测 Node.js 安装路径
- 使用国内镜像加速下载
- 尝试多种安装方式（npm、cnpm、yarn）

### 3. npm 不在 PATH 中

如果提示 npm 未找到：
1. 打开"系统属性" → "高级" → "环境变量"
2. 在"系统变量"中找到 "Path"
3. 添加 Node.js 安装路径（通常是 `C:\Program Files\nodejs\`）
4. 重启命令行窗口

### 4. 图标问题

如果遇到图标相关错误，可以暂时移除 `package.json` 中的 `icon` 配置。

### 5. 权限问题

在Linux上，可能需要给AppImage文件添加执行权限：

```bash
chmod +x dist/高级计算器.AppImage
```

## 技术栈

- **Electron**: 跨平台桌面应用框架
- **HTML/CSS/JavaScript**: 前端界面和逻辑
- **electron-builder**: 应用打包工具

## 许可证

MIT License