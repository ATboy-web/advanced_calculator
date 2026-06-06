高级计算器 - 可执行文件版本
============================

项目已完成！这是一个可以生成真正可执行文件（.exe、.dmg、.AppImage）的版本。

项目位置：
--------
electron-calculator\

快速开始：
--------

1. 确保已安装 Node.js
   - 下载地址: https://nodejs.org/
   - 建议版本: 18.x 或更高

2. 运行计算器：
   - 进入 electron-calculator 目录
   - 双击 run.bat 文件
   - 等待依赖安装完成
   - 计算器将自动启动

3. 构建Windows可执行文件：
   - 进入 electron-calculator 目录
   - 双击 build-win.bat 文件
   - 等待构建完成
   - 可执行文件将生成在 dist 目录中

构建输出：
--------
- Windows: electron-calculator\dist\高级计算器 Setup.exe
- macOS: electron-calculator\dist\高级计算器.dmg (需要在macOS上构建)
- Linux: electron-calculator\dist\高级计算器.AppImage (需要在Linux上构建)

功能特点：
--------
1. 基础计算: 四则运算、百分比、正负切换
2. 科学计算: 三角函数、对数、指数、阶乘、幂运算
3. 函数绘图: 输入数学表达式绘制函数图像
4. 方程求解: 一元一次、一元二次、二元一次方程
5. 单位转换: 长度、重量、温度、面积、体积、速度、数据、进制
6. 计算历史: 保存并复用历史计算结果

支持平台：
--------
- Windows: 生成 .exe 安装包
- macOS: 生成 .dmg 安装包
- Linux: 生成 .AppImage 可执行文件

技术栈：
--------
- Electron: 跨平台桌面应用框架
- HTML/CSS/JavaScript: 前端界面和逻辑
- electron-builder: 应用打包工具

优势：
--------
1. 生成真正的可执行文件，无需浏览器
2. 支持Windows、macOS、Linux三平台
3. 原生应用体验，性能优秀
4. 可以分发给其他用户使用
5. 支持离线使用

注意事项：
--------
1. 需要安装Node.js环境
2. 首次构建需要下载依赖，可能需要一些时间
3. 生成的安装包可能较大（约100-200MB）
4. 需要为不同平台分别构建

现在可以开始构建您的可执行文件了！