import 'dart:math' as math;

/// 高级计算器数学引擎
/// 参考 Calci-kernel 设计，支持复数运算、表达式解析、微积分等
class MathEngine {
  static const double _pi = math.pi;
  static const double _e = math.e;
  
  // 常量
  double get pi => _pi;
  double get e => _e;
  double get phi => (1 + math.sqrt(5)) / 2; // 黄金比例

  /// 表达式求值
  double evaluate(String expression) {
    try {
      // 清理表达式
      expression = expression.replaceAll('×', '*').replaceAll('÷', '/').replaceAll('−', '-');
      
      // 替换常量
      expression = expression.replaceAll('π', '(${_pi})');
      expression = expression.replaceAll('e', '(${_e})');
      
      // 简单的表达式解析器
      return _parseExpression(expression.trim(), {'pos': 0});
    } catch (e) {
      return double.nan;
    }
  }

  double _parseExpression(String expr, Map<String, int> ctx) {
    double result = _parseTerm(expr, ctx);
    
    while (ctx['pos']! < expr.length) {
      String ch = expr[ctx['pos']!];
      if (ch == '+' || ch == '-') {
        ctx['pos'] = ctx['pos']! + 1;
        double term = _parseTerm(expr, ctx);
        result = ch == '+' ? result + term : result - term;
      } else {
        break;
      }
    }
    
    return result;
  }

  double _parseTerm(String expr, Map<String, int> ctx) {
    double result = _parseFactor(expr, ctx);
    
    while (ctx['pos']! < expr.length) {
      String ch = expr[ctx['pos']!];
      if (ch == '*' || ch == '/') {
        ctx['pos'] = ctx['pos']! + 1;
        double factor = _parseFactor(expr, ctx);
        result = ch == '*' ? result * factor : result / factor;
      } else {
        break;
      }
    }
    
    return result;
  }

  double _parseFactor(String expr, Map<String, int> ctx) {
    double base = _parsePower(expr, ctx);
    
    while (ctx['pos']! < expr.length && expr[ctx['pos']!] == '!') {
      ctx['pos'] = ctx['pos']! + 1;
      base = factorial(base.round()).toDouble();
    }
    
    return base;
  }

  double _parsePower(String expr, Map<String, int> ctx) {
    double base = _parseUnary(expr, ctx);
    
    if (ctx['pos']! < expr.length && expr[ctx['pos']!] == '^') {
      ctx['pos'] = ctx['pos']! + 1;
      double exp = _parseUnary(expr, ctx);
      base = math.pow(base, exp).toDouble();
    }
    
    return base;
  }

  double _parseUnary(String expr, Map<String, int> ctx) {
    if (ctx['pos']! < expr.length && expr[ctx['pos']!] == '-') {
      ctx['pos'] = ctx['pos']! + 1;
      return -_parsePrimary(expr, ctx);
    }
    if (ctx['pos']! < expr.length && expr[ctx['pos']!] == '+') {
      ctx['pos'] = ctx['pos']! + 1;
    }
    return _parsePrimary(expr, ctx);
  }

  double _parsePrimary(String expr, Map<String, int> ctx) {
    // 跳过空格
    while (ctx['pos']! < expr.length && expr[ctx['pos']!] == ' ') {
      ctx['pos'] = ctx['pos']! + 1;
    }
    
    // 括号
    if (ctx['pos']! < expr.length && expr[ctx['pos']!] == '(') {
      ctx['pos'] = ctx['pos']! + 1;
      double val = _parseExpression(expr, ctx);
      if (ctx['pos']! < expr.length && expr[ctx['pos']!] == ')') {
        ctx['pos'] = ctx['pos']! + 1;
      }
      return val;
    }
    
    // 数字
    String numStr = '';
    while (ctx['pos']! < expr.length && 
           (RegExp(r'[\d.]').hasMatch(expr[ctx['pos']!]) || 
            (expr[ctx['pos']!] == '-' && numStr.isEmpty))) {
      numStr += expr[ctx['pos']!];
      ctx['pos'] = ctx['pos']! + 1;
    }
    
    // 科学记数法
    if (ctx['pos']! < expr.length && 
        (expr[ctx['pos']!] == 'e' || expr[ctx['pos']!] == 'E')) {
      if (ctx['pos']! + 1 < expr.length && 
          (RegExp(r'[\d-]').hasMatch(expr[ctx['pos']! + 1]))) {
        numStr += expr[ctx['pos']!];
        ctx['pos'] = ctx['pos']! + 1;
        if (expr[ctx['pos']!] == '-') {
          numStr += expr[ctx['pos']!];
          ctx['pos'] = ctx['pos']! + 1;
        }
        while (ctx['pos']! < expr.length && RegExp(r'\d').hasMatch(expr[ctx['pos']!])) {
          numStr += expr[ctx['pos']!];
          ctx['pos'] = ctx['pos']! + 1;
        }
      }
    }
    
    if (numStr.isNotEmpty) {
      return double.parse(numStr);
    }
    
    return double.nan;
  }

  // ==================== 基础数学函数 ====================
  
  double sqrt(double x) => math.sqrt(x);
  double cbrt(double x) => x < 0 ? -math.pow(-x, 1/3).toDouble() : math.pow(x, 1/3).toDouble();
  double pow(double base, double exp) => math.pow(base, exp).toDouble();
  double abs(double x) => x.abs();
  double floor(double x) => x.floorToDouble();
  double ceil(double x) => x.ceilToDouble();
  double round(double x) => x.roundToDouble();
  
  // ==================== 三角函数 ====================
  
  double sin(double x) => math.sin(x);
  double cos(double x) => math.cos(x);
  double tan(double x) => math.tan(x);
  double asin(double x) => math.asin(x);
  double acos(double x) => math.acos(x);
  double atan(double x) => math.atan(x);
  double atan2(double y, double x) => math.atan2(y, x);
  
  // 角度制三角函数
  double sinDeg(double deg) => math.sin(deg * _pi / 180);
  double cosDeg(double deg) => math.cos(deg * _pi / 180);
  double tanDeg(double deg) => math.tan(deg * _pi / 180);
  double asinDeg(double x) => math.asin(x) * 180 / _pi;
  double acosDeg(double x) => math.acos(x) * 180 / _pi;
  double atanDeg(double x) => math.atan(x) * 180 / _pi;
  
  // 双曲函数
  double sinh(double x) => (math.exp(x) - math.exp(-x)) / 2;
  double cosh(double x) => (math.exp(x) + math.exp(-x)) / 2;
  double tanh(double x) => sinh(x) / cosh(x);
  double asinh(double x) => math.log(x + math.sqrt(x * x + 1));
  double acosh(double x) => math.log(x + math.sqrt(x * x - 1));
  double atanh(double x) => math.log((1 + x) / (1 - x)) / 2;
  
  // ==================== 对数函数 ====================
  
  double ln(double x) => math.log(x);
  double log10(double x) => math.log(x) / math.ln10;
  double log2(double x) => math.log(x) / math.ln2;
  double exp(double x) => math.exp(x);
  double exp2(double x) => math.pow(2, x).toDouble();
  double exp10(double x) => math.pow(10, x).toDouble();
  
  // ==================== 特殊函数 ====================
  
  /// 阶乘
  int factorial(int n) {
    if (n < 0) return 0;
    if (n <= 1) return 1;
    int result = 1;
    for (int i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }
  
  /// Gamma函数
  double gamma(double z) {
    if (z < 0.5) {
      return _pi / (math.sin(_pi * z) * gamma(1 - z));
    }
    z -= 1;
    
    const List<double> c = [
      0.99999999999980993,
      676.5203681218851,
      -1259.1392167224028,
      771.32342877765313,
      -176.61502916214059,
      12.507343278686905,
      -0.13857109526572012,
      9.9843695780195716e-6,
      1.5056327351493116e-7,
    ];
    
    double x = c[0];
    for (int i = 1; i < c.length; i++) {
      x += c[i] / (z + i);
    }
    
    double t = z + 7 + 0.5;
    return math.sqrt(2 * _pi) * math.pow(t, z + 0.5) * math.exp(-t) * x;
  }
  
  /// 最大公约数
  int gcd(int a, int b) {
    a = a.abs();
    b = b.abs();
    while (b != 0) {
      int temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
  
  /// 最小公倍数
  int lcm(int a, int b) {
    return (a * b).abs() ~/ gcd(a, b);
  }
  
  /// 排列数 P(n, r)
  int perm(int n, int r) {
    if (r < 0 || r > n) return 0;
    return factorial(n) ~/ factorial(n - r);
  }
  
  /// 组合数 C(n, r)
  int comb(int n, int r) {
    if (r < 0 || r > n) return 0;
    return factorial(n) ~/ (factorial(r) * factorial(n - r));
  }
  
  /// 质数判断
  bool isPrime(int n) {
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (int i = 5; i * i <= n; i += 6) {
      if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
  }
  
  // ==================== 微积分数值计算 ====================
  
  /// 数值导数 (中心差分)
  double derivative(double Function(double) f, double x, {double h = 1e-8}) {
    return (f(x + h) - f(x - h)) / (2 * h);
  }
  
  /// 数值积分 (Simpson's rule)
  double integral(double Function(double) f, double a, double b, {int n = 1000}) {
    double h = (b - a) / n;
    double sum = f(a) + f(b);
    
    for (int i = 1; i < n; i++) {
      sum += (i % 2 == 0 ? 2 : 4) * f(a + i * h);
    }
    
    return (h / 3) * sum;
  }
  
  /// 求极限
  double limit(double Function(double) f, double x0, {int dir = 0}) {
    double h = 1e-10;
    if (dir == 0) {
      return (f(x0 + h) + f(x0 - h)) / 2;
    }
    return dir > 0 ? f(x0 + h) : f(x0 - h);
  }
  
  /// 牛顿法求根
  double findRoot(double Function(double) f, double x0, {int maxIter = 100}) {
    double x = x0;
    for (int i = 0; i < maxIter; i++) {
      double fx = f(x);
      if (fx.abs() < 1e-12) return x;
      
      double dx = 1e-8;
      double fpx = (f(x + dx) - fx) / dx;
      if (fpx.abs() < 1e-15) break;
      
      double x1 = x - fx / fpx;
      if ((x1 - x).abs() < 1e-12) return x1;
      x = x1;
    }
    return x;
  }
  
  // ==================== 方程求解 ====================
  
  /// 求解一元二次方程 ax² + bx + c = 0
  Map<String, dynamic> solveQuadratic(double a, double b, double c) {
    double disc = b * b - 4 * a * c;
    
    if (disc > 0) {
      double sqrtDisc = math.sqrt(disc);
      return {
        'type': 'real',
        'x1': (-b + sqrtDisc) / (2 * a),
        'x2': (-b - sqrtDisc) / (2 * a),
      };
    } else if (disc == 0) {
      return {
        'type': 'repeated',
        'x1': -b / (2 * a),
      };
    } else {
      double realPart = -b / (2 * a);
      double imagPart = math.sqrt(-disc) / (2 * a);
      return {
        'type': 'complex',
        'x1': {'re': realPart, 'im': imagPart},
        'x2': {'re': realPart, 'im': -imagPart},
      };
    }
  }
  
  /// 求解2x2线性方程组
  Map<String, dynamic> solveSystem2x2(
    double a1, double b1, double c1,
    double a2, double b2, double c2,
  ) {
    double det = a1 * b2 - a2 * b1;
    
    if (det.abs() < 1e-10) {
      return {'type': 'no_unique'};
    }
    
    return {
      'type': 'unique',
      'x': (c1 * b2 - c2 * b1) / det,
      'y': (a1 * c2 - a2 * c1) / det,
    };
  }
  
  // ==================== 复数运算 ====================
  
  Map<String, double> complexAdd(Map<String, double> a, Map<String, double> b) {
    return {'re': a['re']! + b['re']!, 'im': a['im']! + b['im']!};
  }
  
  Map<String, double> complexSub(Map<String, double> a, Map<String, double> b) {
    return {'re': a['re']! - b['re']!, 'im': a['im']! - b['im']!};
  }
  
  Map<String, double> complexMul(Map<String, double> a, Map<String, double> b) {
    return {
      're': a['re']! * b['re']! - a['im']! * b['im']!,
      'im': a['re']! * b['im']! + a['im']! * b['re']!,
    };
  }
  
  Map<String, double> complexDiv(Map<String, double> a, Map<String, double> b) {
    double d = b['re']! * b['re']! + b['im']! * b['im']!;
    return {
      're': (a['re']! * b['re']! + a['im']! * b['im']!) / d,
      'im': (a['im']! * b['re']! - a['re']! * b['im']!) / d,
    };
  }
  
  double complexAbs(Map<String, double> z) {
    return math.sqrt(z['re']! * z['re']! + z['im']! * z['im']!);
  }
  
  double complexArg(Map<String, double> z) {
    return math.atan2(z['im']!, z['re']!);
  }
  
  Map<String, double> complexConj(Map<String, double> z) {
    return {'re': z['re']!, 'im': -z['im']!};
  }
  
  String complexToString(Map<String, double> z) {
    if (z['im'] == 0) return '${z['re']}';
    if (z['re'] == 0) return '${z['im']}i';
    return '${z['re']}${z['im']! >= 0 ? '+' : ''}${z['im']}i';
  }
  
  // ==================== 进制转换 ====================
  
  String baseConvert(String num, int fromBase, int toBase) {
    int decimal = int.parse(num, radix: fromBase);
    return decimal.toRadixString(toBase).toUpperCase();
  }
  
  // ==================== 格式化 ====================
  
  String formatNumber(double num, {int precision = 10}) {
    if (num.isNaN) return 'Error';
    if (num.isInfinite) return num > 0 ? '∞' : '-∞';
    
    if (num == num.roundToDouble() && num.abs() < 1e15) {
      return num.round().toString();
    }
    
    String fixed = num.toStringAsPrecision(precision);
    // 去除尾部多余的零
    if (fixed.contains('.')) {
      fixed = fixed.replaceAll(RegExp(r'0+$'), '');
      fixed = fixed.replaceAll(RegExp(r'\.$'), '');
    }
    
    return fixed;
  }
  
  // 函数求值 (用于绘图)
  double Function(double) createFunction(String expr) {
    return (double x) {
      String processed = expr.replaceAll('x', '($x)');
      return evaluate(processed);
    };
  }
}