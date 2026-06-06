# 高级计算器 (Advanced Calculator)

一款功能强大的跨平台计算器应用，基于 Flutter 构建，支持 iOS、Android、Web、Windows、macOS 和 Linux。

## 功能特性

### 基础计算
- 加减乘除四则运算
- 百分比计算
- 括号嵌套
- 历史记录

### 科学计算
- 三角函数 (sin, cos, tan, asin, acos, atan)
- 双曲函数 (sinh, cosh, tanh)
- 对数函数 (ln, log, log2)
- 指数函数 (e^x, 10^x, 2^x)
- 幂运算 (x², x³, x^y)
- 根号运算 (√, ∛)
- 阶乘 (n!)
- 常数 (π, e)

### 函数绘图
- 支持绘制多个函数图像
- 自定义坐标范围
- 网格和坐标轴显示
- 实时交互

### 方程求解
- 一元一次方程 (ax + b = 0)
- 一元二次方程 (ax² + bx + c = 0)
- 多项式方程
- 二元一次方程组

### 单位转换
- 长度 (毫米、厘米、米、千米、英寸、英尺等)
- 重量 (克、千克、吨、磅、盎司等)
- 温度 (摄氏、华氏、开尔文)
- 面积、体积、速度、数据存储、时间
- 进制转换 (二进制、八进制、十进制、十六进制)

### 其他功能
- 暗色/亮色主题切换
- 历史记录保存
- 键盘快捷键支持
- 响应式设计，适配各种屏幕尺寸

## 平台支持

| 平台 | 状态 |
|------|------|
| Android | ✅ 支持 |
| iOS | ✅ 支持 |
| Web | ✅ 支持 |
| Windows | ✅ 支持 |
| macOS | ✅ 支持 |
| Linux | ✅ 支持 |

## 快速开始

### 前提条件

1. 安装 Flutter SDK
   ```bash
   # Windows (使用 PowerShell)
   Invoke-WebRequest -Uri "https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.29.3-stable.zip" -OutFile "flutter.zip"
   Expand-Archive -Path "flutter.zip" -DestinationPath "C:\"
   $env:Path = "C:\flutter\bin;$env:Path"
   
   # macOS
   cd ~/development
   unzip ~/Downloads/flutter_macos_3.29.3-stable.zip
   
   # Linux
   cd ~/development
   tar xf ~/Downloads/flutter_linux_3.29.3-stable.tar.xz
   ```

2. 验证安装
   ```bash
   flutter doctor
   ```

### 安装依赖

```bash
cd advanced_calculator
flutter pub get
```

### 运行应用

```bash
# Android
flutter run -d android

# iOS
flutter run -d ios

# Web
flutter run -d chrome

# Windows
flutter run -d windows

# macOS
flutter run -d macos

# Linux
flutter run -d linux
```

### 构建发布版本

```bash
# Android APK
flutter build apk

# Android App Bundle
flutter build appbundle

# iOS
flutter build ios

# Web
flutter build web

# Windows
flutter build windows

# macOS
flutter build macos

# Linux
flutter build linux
```

## 项目结构

```
advanced_calculator/
├── lib/
│   ├── main.dart                    # 应用入口
│   ├── providers/
│   │   ├── calculator_provider.dart # 计算器状态管理
│   │   └── theme_provider.dart      # 主题管理
│   ├── screens/
│   │   ├── home_screen.dart         # 主屏幕
│   │   ├── basic_calculator.dart    # 基础计算器
│   │   ├── scientific_calculator.dart # 科学计算器
│   │   ├── graphing_screen.dart     # 函数绘图
│   │   ├── equation_solver.dart     # 方程求解
│   │   ├── converter_screen.dart    # 单位转换
│   │   └── history_screen.dart      # 历史记录
│   ├── widgets/
│   │   ├── calculator_button.dart   # 计算器按钮组件
│   │   └── display_panel.dart       # 显示面板组件
│   ├── models/
│   │   └── calculation_history.dart # 计算历史模型
│   └── utils/
│       └── math_engine.dart         # 数学引擎
├── assets/
│   ├── images/
│   └── fonts/
├── test/
├── pubspec.yaml
└── README.md
```

## 技术栈

- **Flutter** - 跨平台UI框架
- **Provider** - 状态管理
- **math_expressions** - 数学表达式解析
- **fl_chart** - 图表绘制
- **shared_preferences** - 本地存储
- **flutter_screenutil** - 屏幕适配

## 开发指南

### 添加新函数

在 `lib/utils/math_engine.dart` 中添加新函数：

```javascript
double myFunction(double x) {
  // 实现逻辑
  return result;
}
```

### 添加新单位转换

在 `lib/screens/converter_screen.dart` 中添加新类型：

```javascript
final Map<ConverterType, List<String>> _units = {
  // ... 现有类型
  ConverterType.myType: ['单位1', '单位2', ...],
};

double _convertMyType(double value, int from, int to) {
  // 转换逻辑
}
```

### 添加新方程类型

在 `lib/screens/equation_solver.dart` 中添加新方程类型：

```javascript
enum EquationType {
  // ... 现有类型
  myEquation,
}
```

## 许可证

MIT License

## 参考项目

- [DarkCalculator](https://github.com/HK-SHAO/DarkCalculator) - 黑暗计算器
- [Calci-kernel](https://github.com/Iraka-C/Calci-kernel) - Java复数计算内核
- [Symbolab](https://zs.symbolab.com) - AI数学计算器