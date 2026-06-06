import 'package:flutter/material.dart';
import '../models/calculation_history.dart';
import '../utils/math_engine.dart';

enum CalculatorMode {
  basic,
  scientific,
  graphing,
  equation,
  converter,
  history,
}

class CalculatorProvider with ChangeNotifier {
  final MathEngine _mathEngine = MathEngine();
  final List<CalculationHistory> _history = [];
  
  String _currentDisplay = '0';
  String _expression = '';
  String _historyExpression = '';
  bool _isNewNumber = true;
  bool _isShifted = false;
  bool _isDegree = true;
  double? _lastResult;
  CalculatorMode _currentMode = CalculatorMode.basic;
  int _bracketCount = 0;

  // Getters
  String get currentDisplay => _currentDisplay;
  String get expression => _expression;
  String get historyExpression => _historyExpression;
  bool get isNewNumber => _isNewNumber;
  bool get isShifted => _isShifted;
  bool get isDegree => _isDegree;
  CalculatorMode get currentMode => _currentMode;
  List<CalculationHistory> get history => List.unmodifiable(_history);
  MathEngine get mathEngine => _mathEngine;

  // 切换模式
  void switchMode(CalculatorMode mode) {
    _currentMode = mode;
    notifyListeners();
  }

  // 输入数字
  void inputDigit(String digit) {
    if (_isNewNumber) {
      _currentDisplay = digit == '.' ? '0.' : digit;
      _isNewNumber = false;
    } else {
      if (digit == '.' && _currentDisplay.contains('.')) return;
      _currentDisplay += digit;
    }
    notifyListeners();
  }

  // 输入运算符
  void inputOperator(String op) {
    final opSymbols = {
      'add': ' + ', 'subtract': ' - ', 
      'multiply': ' × ', 'divide': ' ÷ ', 'power': ' ^ '
    };
    
    if (!_isNewNumber || _lastResult != null) {
      _expression += _currentDisplay + (opSymbols[op] ?? ' $op ');
    } else {
      _expression = _expression.replaceFirst(RegExp(r'\s[+\-×÷^]\s$'), '') + 
          (opSymbols[op] ?? ' $op ');
    }
    _historyExpression = _expression;
    _isNewNumber = true;
    notifyListeners();
  }

  // 输入括号
  void inputParen(String paren) {
    if (paren == '(') {
      if (!_isNewNumber) {
        _expression += '$_currentDisplay × ';
      }
      _expression += '(';
      _bracketCount++;
      _isNewNumber = true;
    } else if (paren == ')' && _bracketCount > 0) {
      _expression += '$_currentDisplay)';
      _bracketCount--;
      _isNewNumber = true;
    }
    _historyExpression = _expression;
    notifyListeners();
  }

  // 应用函数
  void applyFunction(String fn) {
    double num = double.tryParse(_currentDisplay) ?? 0;
    double result;

    switch (fn) {
      case 'square':
        result = num * num;
        break;
      case 'cube':
        result = num * num * num;
        break;
      case 'inv':
        result = 1 / num;
        break;
      case 'abs':
        result = num.abs();
        break;
      case 'exp':
        result = _mathEngine.exp(num);
        break;
      case 'tenPow':
        result = _mathEngine.pow(10, num);
        break;
      case 'sqrt':
        result = _mathEngine.sqrt(num);
        break;
      case 'cbrt':
        result = _mathEngine.cbrt(num);
        break;
      case 'ln':
        result = _mathEngine.ln(num);
        break;
      case 'log':
        result = _mathEngine.log10(num);
        break;
      case 'log2':
        result = _mathEngine.log2(num);
        break;
      case 'factorial':
        result = _mathEngine.factorial(num.round()).toDouble();
        break;
      case 'sin':
        result = _isDegree 
            ? _mathEngine.sinDeg(num) 
            : _mathEngine.sin(num);
        break;
      case 'cos':
        result = _isDegree 
            ? _mathEngine.cosDeg(num) 
            : _mathEngine.cos(num);
        break;
      case 'tan':
        result = _isDegree 
            ? _mathEngine.tanDeg(num) 
            : _mathEngine.tan(num);
        break;
      case 'asin':
        result = _isDegree 
            ? _mathEngine.asinDeg(num) 
            : _mathEngine.asin(num);
        break;
      case 'acos':
        result = _isDegree 
            ? _mathEngine.acosDeg(num) 
            : _mathEngine.acos(num);
        break;
      case 'atan':
        result = _isDegree 
            ? _mathEngine.atanDeg(num) 
            : _mathEngine.atan(num);
        break;
      case 'sinh':
        result = _mathEngine.sinh(num);
        break;
      case 'cosh':
        result = _mathEngine.cosh(num);
        break;
      case 'tanh':
        result = _mathEngine.tanh(num);
        break;
      default:
        result = num;
    }

    _historyExpression = '$fn($_currentDisplay)';
    _currentDisplay = _mathEngine.formatNumber(result);
    _isNewNumber = true;
    _lastResult = result;
    notifyListeners();
  }

  // 计算结果
  void calculate() {
    try {
      String expr = _expression + _currentDisplay;
      if (_bracketCount > 0) {
        expr += ')' * _bracketCount;
        _bracketCount = 0;
      }

      final result = _mathEngine.evaluate(expr);
      
      _historyExpression = '$expr =';
      _history.insert(0, CalculationHistory(
        expression: expr,
        result: _mathEngine.formatNumber(result),
        timestamp: DateTime.now(),
      ));
      
      _currentDisplay = _mathEngine.formatNumber(result);
      _expression = '';
      _isNewNumber = true;
      _lastResult = result;
      notifyListeners();
    } catch (e) {
      _currentDisplay = 'Error';
      notifyListeners();
    }
  }

  // 清除
  void clear() {
    _currentDisplay = '0';
    _historyExpression = '';
    _expression = '';
    _isNewNumber = true;
    _lastResult = null;
    _bracketCount = 0;
    notifyListeners();
  }

  // 退格
  void backspace() {
    if (_isNewNumber) return;
    _currentDisplay = _currentDisplay.length > 1 
        ? _currentDisplay.substring(0, _currentDisplay.length - 1) 
        : '0';
    if (_currentDisplay == '0') _isNewNumber = true;
    notifyListeners();
  }

  // 百分比
  void percent() {
    double num = double.tryParse(_currentDisplay) ?? 0;
    _currentDisplay = _mathEngine.formatNumber(num / 100);
    _isNewNumber = true;
    notifyListeners();
  }

  // 取反
  void negate() {
    if (_currentDisplay == '0') return;
    _currentDisplay = _currentDisplay.startsWith('-')
        ? _currentDisplay.substring(1)
        : '-$_currentDisplay';
    notifyListeners();
  }

  // 切换Shift
  void toggleShift() {
    _isShifted = !_isShifted;
    notifyListeners();
  }

  // 切换角度/弧度
  void toggleAngleMode() {
    _isDegree = !_isDegree;
    notifyListeners();
  }

  // 插入常数
  void insertConstant(double value, String symbol) {
    _currentDisplay = value.toString();
    _isNewNumber = false;
    notifyListeners();
  }

  // 清空历史
  void clearHistory() {
    _history.clear();
    notifyListeners();
  }

  // 使用历史记录
  void useHistory(CalculationHistory item) {
    _currentDisplay = item.result;
    _isNewNumber = true;
    switchMode(CalculatorMode.basic);
    notifyListeners();
  }
}