import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/calculator_provider.dart';
import '../providers/theme_provider.dart';

enum EquationType {
  linear,
  quadratic,
  polynomial,
  system,
}

class EquationSolver extends StatefulWidget {
  const EquationSolver({super.key});

  @override
  State<EquationSolver> createState() => _EquationSolverState();
}

class _EquationSolverState extends State<EquationSolver> {
  EquationType _currentType = EquationType.linear;
  
  // 线性方程 ax + b = 0
  final _linearA = TextEditingController(text: '2');
  final _linearB = TextEditingController(text: '-6');
  String _linearResult = '';
  
  // 二次方程 ax² + bx + c = 0
  final _quadA = TextEditingController(text: '1');
  final _quadB = TextEditingController(text: '-5');
  final _quadC = TextEditingController(text: '6');
  String _quadraticResult = '';
  
  // 多项式方程
  final _polyEquation = TextEditingController(text: 'x^3 - 6x^2 + 11x - 6');
  String _polyResult = '';
  
  // 方程组
  final _sysA1 = TextEditingController(text: '2');
  final _sysB1 = TextEditingController(text: '3');
  final _sysC1 = TextEditingController(text: '8');
  final _sysA2 = TextEditingController(text: '3');
  final _sysB2 = TextEditingController(text: '-2');
  final _sysC2 = TextEditingController(text: '1');
  String _systemResult = '';

  @override
  void dispose() {
    _linearA.dispose();
    _linearB.dispose();
    _quadA.dispose();
    _quadB.dispose();
    _quadC.dispose();
    _polyEquation.dispose();
    _sysA1.dispose();
    _sysB1.dispose();
    _sysC1.dispose();
    _sysA2.dispose();
    _sysB2.dispose();
    _sysC2.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Provider.of<ThemeProvider>(context);
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 方程类型选择
          _buildTypeSelector(theme),
          const SizedBox(height: 16),
          // 方程输入面板
          _buildEquationPanel(theme),
        ],
      ),
    );
  }

  Widget _buildTypeSelector(ThemeProvider theme) {
    return Wrap(
      spacing: 8,
      children: [
        _buildTypeChip('线性方程', EquationType.linear, theme),
        _buildTypeChip('二次方程', EquationType.quadratic, theme),
        _buildTypeChip('多项式方程', EquationType.polynomial, theme),
        _buildTypeChip('方程组', EquationType.system, theme),
      ],
    );
  }

  Widget _buildTypeChip(String label, EquationType type, ThemeProvider theme) {
    final isSelected = _currentType == type;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      selectedColor: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : theme.textColor,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
      onSelected: (selected) {
        if (selected) {
          setState(() => _currentType = type);
        }
      },
    );
  }

  Widget _buildEquationPanel(ThemeProvider theme) {
    switch (_currentType) {
      case EquationType.linear:
        return _buildLinearPanel(theme);
      case EquationType.quadratic:
        return _buildQuadraticPanel(theme);
      case EquationType.polynomial:
        return _buildPolynomialPanel(theme);
      case EquationType.system:
        return _buildSystemPanel(theme);
    }
  }

  Widget _buildLinearPanel(ThemeProvider theme) {
    return Card(
      color: theme.isDark ? const Color(0xFF16213E) : Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              '一元一次方程 ax + b = 0',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: _buildNumberField('a =', _linearA, theme)),
                const SizedBox(width: 16),
                Expanded(child: _buildNumberField('b =', _linearB, theme)),
              ],
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _solveLinear,
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight,
                foregroundColor: Colors.white,
              ),
              child: const Text('求解'),
            ),
            if (_linearResult.isNotEmpty) ...[
              const SizedBox(height: 16),
              _buildResultContainer(_linearResult, theme),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildQuadraticPanel(ThemeProvider theme) {
    return Card(
      color: theme.isDark ? const Color(0xFF16213E) : Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              '一元二次方程 ax² + bx + c = 0',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: _buildNumberField('a =', _quadA, theme)),
                const SizedBox(width: 8),
                Expanded(child: _buildNumberField('b =', _quadB, theme)),
                const SizedBox(width: 8),
                Expanded(child: _buildNumberField('c =', _quadC, theme)),
              ],
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _solveQuadratic,
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight,
                foregroundColor: Colors.white,
              ),
              child: const Text('求解'),
            ),
            if (_quadraticResult.isNotEmpty) ...[
              const SizedBox(height: 16),
              _buildResultContainer(_quadraticResult, theme),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildPolynomialPanel(ThemeProvider theme) {
    return Card(
      color: theme.isDark ? const Color(0xFF16213E) : Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              '多项式方程',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _polyEquation,
              style: TextStyle(color: theme.textColor, fontFamily: 'monospace'),
              decoration: InputDecoration(
                labelText: '输入方程 (例如: x^3 - 6x^2 + 11x - 6)',
                labelStyle: TextStyle(color: theme.textSecondary),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _solvePolynomial,
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight,
                foregroundColor: Colors.white,
              ),
              child: const Text('求解'),
            ),
            if (_polyResult.isNotEmpty) ...[
              const SizedBox(height: 16),
              _buildResultContainer(_polyResult, theme),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildSystemPanel(ThemeProvider theme) {
    return Card(
      color: theme.isDark ? const Color(0xFF16213E) : Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              '二元一次方程组',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight,
              ),
            ),
            const SizedBox(height: 16),
            _buildSystemRow(_sysA1, _sysB1, _sysC1, theme),
            const SizedBox(height: 8),
            _buildSystemRow(_sysA2, _sysB2, _sysC2, theme),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _solveSystem,
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight,
                foregroundColor: Colors.white,
              ),
              child: const Text('求解'),
            ),
            if (_systemResult.isNotEmpty) ...[
              const SizedBox(height: 16),
              _buildResultContainer(_systemResult, theme),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildNumberField(String label, TextEditingController controller, ThemeProvider theme) {
    return TextField(
      controller: controller,
      keyboardType: TextInputType.number,
      style: TextStyle(color: theme.textColor),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: theme.textSecondary),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      ),
    );
  }

  Widget _buildSystemRow(
    TextEditingController a,
    TextEditingController b,
    TextEditingController c,
    ThemeProvider theme,
  ) {
    return Row(
      children: [
        SizedBox(
          width: 60,
          child: TextField(
            controller: a,
            keyboardType: TextInputType.number,
            style: TextStyle(color: theme.textColor),
            textAlign: TextAlign.center,
            decoration: InputDecoration(
              contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Text('x +', style: TextStyle(color: theme.textColor)),
        ),
        SizedBox(
          width: 60,
          child: TextField(
            controller: b,
            keyboardType: TextInputType.number,
            style: TextStyle(color: theme.textColor),
            textAlign: TextAlign.center,
            decoration: InputDecoration(
              contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Text('y =', style: TextStyle(color: theme.textColor)),
        ),
        SizedBox(
          width: 60,
          child: TextField(
            controller: c,
            keyboardType: TextInputType.number,
            style: TextStyle(color: theme.textColor),
            textAlign: TextAlign.center,
            decoration: InputDecoration(
              contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildResultContainer(String result, ThemeProvider theme) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.isDark ? const Color(0xFF0A0A1A) : const Color(0xFFF5F5F5),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        result,
        style: TextStyle(
          fontFamily: 'monospace',
          fontSize: 14,
          color: result.contains('Error') ? ThemeProvider.accentRed : ThemeProvider.accentGreen,
        ),
      ),
    );
  }

  void _solveLinear() {
    final a = double.tryParse(_linearA.text) ?? 0;
    final b = double.tryParse(_linearB.text) ?? 0;
    
    setState(() {
      if (a == 0) {
        _linearResult = b == 0 ? '方程有无穷多解' : '方程无解';
      } else {
        final x = -b / a;
        _linearResult = 'x = ${_formatNumber(x)}';
      }
    });
  }

  void _solveQuadratic() {
    final a = double.tryParse(_quadA.text) ?? 0;
    final b = double.tryParse(_quadB.text) ?? 0;
    final c = double.tryParse(_quadC.text) ?? 0;
    
    if (a == 0) {
      setState(() => _quadraticResult = 'Error: a 不能为 0');
      return;
    }
    
    final calculator = Provider.of<CalculatorProvider>(context, listen: false);
    final result = calculator.mathEngine.solveQuadratic(a, b, c);
    
    setState(() {
      if (result['type'] == 'real') {
        _quadraticResult = 'x₁ = ${_formatNumber(result['x1'])}\nx₂ = ${_formatNumber(result['x2'])}';
      } else if (result['type'] == 'repeated') {
        _quadraticResult = 'x = ${_formatNumber(result['x1'])} (重根)';
      } else {
        final x1 = result['x1'] as Map<String, double>;
        final x2 = result['x2'] as Map<String, double>;
        _quadraticResult = 'x₁ = ${x1['re']!.toStringAsFixed(4)} + ${x1['im']!.toStringAsFixed(4)}i\n'
            'x₂ = ${x2['re']!.toStringAsFixed(4)} + ${x2['im']!.toStringAsFixed(4)}i';
      }
    });
  }

  void _solvePolynomial() {
    // 简化实现：使用牛顿法求根
    setState(() {
      _polyResult = '多项式求根功能需要更复杂的实现\n当前版本支持线性和二次方程';
    });
  }

  void _solveSystem() {
    final a1 = double.tryParse(_sysA1.text) ?? 0;
    final b1 = double.tryParse(_sysB1.text) ?? 0;
    final c1 = double.tryParse(_sysC1.text) ?? 0;
    final a2 = double.tryParse(_sysA2.text) ?? 0;
    final b2 = double.tryParse(_sysB2.text) ?? 0;
    final c2 = double.tryParse(_sysC2.text) ?? 0;
    
    final calculator = Provider.of<CalculatorProvider>(context, listen: false);
    final result = calculator.mathEngine.solveSystem2x2(a1, b1, c1, a2, b2, c2);
    
    setState(() {
      if (result['type'] == 'unique') {
        _systemResult = 'x = ${_formatNumber(result['x'])}\ny = ${_formatNumber(result['y'])}';
      } else {
        _systemResult = '方程组无唯一解（系数行列式为零）';
      }
    });
  }

  String _formatNumber(double num) {
    if (num == num.roundToDouble() && num.abs() < 1e10) {
      return num.round().toString();
    }
    return num.toStringAsFixed(6).replaceAll(RegExp(r'0+$'), '').replaceAll(RegExp(r'\.$'), '');
  }
}