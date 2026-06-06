# 高级计算器 - PWA版本

## 功能特点

- **基础计算**: 四则运算、百分比、正负切换
- **科学计算**: 三角函数、对数、指数、阶乘、幂运算
- **函数绘图**: 输入函数表达式绘制图像
- **方程求解**: 一元一次、一元二次、二元一次方程
- **单位转换**: 长度、重量、温度、面积、体积、速度、数据、进制
- **计算历史**: 记录并可复用历史结果

## 运行方式

### 方法1: 双击运行 (推荐)
1. 双击 `启动计算器.bat` 文件
2. 浏览器会自动打开计算器页面

### 方法2: 直接打开HTML文件
1. 双击 `index.html` 文件
2. 直接在浏览器中使用

### 方法3: 使用本地服务器 (支持PWA离线功能)
1. 打开命令提示符/PowerShell
2. 进入calculator目录
3. 运行: `python -m http.server 8080`
4. 浏览器访问: `http://localhost:8080`

## 支持平台

- **桌面端**: Windows/macOS/Linux 浏览器
- **移动端**: iOS/Android 浏览器
- **PWA安装**: 在支持PWA的浏览器中可安装为本地应用

## 键盘快捷键

- 数字键 0-9: 输入数字
- +, -, *, /: 运算符
- Enter 或 =: 计算结果
- Backspace: 退格
- Escape 或 C: 清除
- %: 百分比
- (, ): 括号

## 技术栈

- HTML5 + CSS3 + JavaScript
- PWA (Progressive Web App)
- Canvas API (函数绘图)
- 响应式设计 (支持移动端)

## 文件结构

```
calculator/
├── index.html      # 主页面
├── app.js          # 计算器逻辑
├── manifest.json   # PWA配置
├── sw.js           # Service Worker (离线支持)
├── 启动计算器.bat   # Windows启动脚本
└── README.md       # 说明文档
```