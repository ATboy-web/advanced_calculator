import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/calculator_provider.dart';
import '../providers/theme_provider.dart';

class GraphingScreen extends StatefulWidget {
  const GraphingScreen({super.key});

  @override
  State<GraphingScreen> createState() => _GraphingScreenState();
}

class _GraphingScreenState extends State<GraphingScreen> {
  final List<TextEditingController> _functionControllers = [
    TextEditingController(text: 'sin(x)'),
  ];
  final List<Color> _functionColors = [
    Colors.blue,
    Colors.green,
    Colors.orange,
    Colors.red,
    Colors.purple,
  ];
  
  double _xMin = -10;
  double _xMax = 10;
  double _yMin = -10;
  double _yMax = 10;
  
  @override
  void dispose() {
    for (var controller in _functionControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Provider.of<ThemeProvider>(context);
    final calculator = Provider.of<CalculatorProvider>(context);
    
    return Column(
      children: [
        // 函数输入区域
        Container(
          padding: const EdgeInsets.all(16),
          color: theme.isDark ? const Color(0xFF16213E) : Colors.white,
          child: Column(
            children: [
              // 函数输入框
              ..._buildFunctionInputs(theme),
              const SizedBox(height: 8),
              // 添加函数按钮
              if (_functionControllers.length < 5)
                TextButton.icon(
                  onPressed: _addFunction,
                  icon: const Icon(Icons.add),
                  label: const Text('添加函数'),
                ),
              const SizedBox(height: 8),
              // 范围控制
              _buildRangeControls(theme),
              const SizedBox(height: 8),
              // 绘制按钮
              ElevatedButton(
                onPressed: () => setState(() {}),
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 44),
                ),
                child: const Text('绘制'),
              ),
            ],
          ),
        ),
        // 图表区域
        Expanded(
          child: Container(
            color: const Color(0xFF0D1117),
            child: _buildChart(calculator),
          ),
        ),
      ],
    );
  }

  List<Widget> _buildFunctionInputs(ThemeProvider theme) {
    return List.generate(_functionControllers.length, (index) {
      return Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Row(
          children: [
            // 颜色标识
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: _functionColors[index % _functionColors.length],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Center(
                child: Text(
                  'f${index + 1}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            // 输入框
            Expanded(
              child: TextField(
                controller: _functionControllers[index],
                style: TextStyle(
                  color: theme.textColor,
                  fontFamily: 'monospace',
                ),
                decoration: InputDecoration(
                  hintText: '例如: x^2, sin(x), log(x)',
                  hintStyle: TextStyle(color: theme.textSecondary),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(color: theme.borderColor),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(color: theme.borderColor),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(color: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight),
                  ),
                ),
              ),
            ),
            // 删除按钮
            if (_functionControllers.length > 1)
              IconButton(
                icon: Icon(Icons.close, color: theme.textSecondary, size: 20),
                onPressed: () => _removeFunction(index),
              ),
          ],
        ),
      );
    });
  }

  Widget _buildRangeControls(ThemeProvider theme) {
    return Row(
      children: [
        _buildRangeField('X:', _xMin, (v) => setState(() => _xMin = v), theme),
        const Text(' ~ '),
        _buildRangeField('', _xMax, (v) => setState(() => _xMax = v), theme),
        const SizedBox(width: 16),
        _buildRangeField('Y:', _yMin, (v) => setState(() => _yMin = v), theme),
        const Text(' ~ '),
        _buildRangeField('', _yMax, (v) => setState(() => _yMax = v), theme),
      ],
    );
  }

  Widget _buildRangeField(String label, double value, ValueChanged<double> onChanged, ThemeProvider theme) {
    return Expanded(
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (label.isNotEmpty)
            Text(label, style: TextStyle(color: theme.textColor, fontSize: 12)),
          SizedBox(
            width: 50,
            child: TextField(
              controller: TextEditingController(text: value.toStringAsFixed(0)),
              keyboardType: TextInputType.number,
              style: TextStyle(color: theme.textColor, fontSize: 12),
              textAlign: TextAlign.center,
              decoration: InputDecoration(
                contentPadding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(4),
                  borderSide: BorderSide(color: theme.borderColor),
                ),
                isDense: true,
              ),
              onSubmitted: (v) {
                final parsed = double.tryParse(v);
                if (parsed != null) onChanged(parsed);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChart(CalculatorProvider calculator) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return CustomPaint(
          size: Size(constraints.maxWidth, constraints.maxHeight),
          painter: _GraphPainter(
            functionControllers: _functionControllers,
            functionColors: _functionColors,
            xMin: _xMin,
            xMax: _xMax,
            yMin: _yMin,
            yMax: _yMax,
            mathEngine: calculator.mathEngine,
          ),
        );
      },
    );
  }

  void _addFunction() {
    if (_functionControllers.length < 5) {
      setState(() {
        _functionControllers.add(TextEditingController());
      });
    }
  }

  void _removeFunction(int index) {
    if (_functionControllers.length > 1) {
      setState(() {
        _functionControllers[index].dispose();
        _functionControllers.removeAt(index);
      });
    }
  }
}

class _GraphPainter extends CustomPainter {
  final List<TextEditingController> functionControllers;
  final List<Color> functionColors;
  final double xMin, xMax, yMin, yMax;
  final dynamic mathEngine;

  _GraphPainter({
    required this.functionControllers,
    required this.functionColors,
    required this.xMin,
    required this.xMax,
    required this.yMin,
    required this.yMax,
    required this.mathEngine,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final gridPaint = Paint()
      ..color = const Color(0xFF1E2A3A)
      ..strokeWidth = 0.5;

    final axisPaint = Paint()
      ..color = const Color(0xFF444C56)
      ..strokeWidth = 1.5;

    // Draw grid
    double xStep = _getGridStep(xMax - xMin);
    double yStep = _getGridStep(yMax - yMin);

    for (double x = (xMin / xStep).ceil() * xStep; x <= xMax; x += xStep) {
      double sx = _toScreenX(x, size.width);
      canvas.drawLine(Offset(sx, 0), Offset(sx, size.height), gridPaint);
    }
    for (double y = (yMin / yStep).ceil() * yStep; y <= yMax; y += yStep) {
      double sy = _toScreenY(y, size.height);
      canvas.drawLine(Offset(0, sy), Offset(size.width, sy), gridPaint);
    }

    // Draw axes
    if (xMin <= 0 && xMax >= 0) {
      double sx = _toScreenX(0, size.width);
      canvas.drawLine(Offset(sx, 0), Offset(sx, size.height), axisPaint);
    }
    if (yMin <= 0 && yMax >= 0) {
      double sy = _toScreenY(0, size.height);
      canvas.drawLine(Offset(0, sy), Offset(size.width, sy), axisPaint);
    }

    // Draw functions
    for (int i = 0; i < functionControllers.length; i++) {
      final func = mathEngine.createFunction(functionControllers[i].text);
      final paint = Paint()
        ..color = functionColors[i % functionColors.length]
        ..strokeWidth = 2.5
        ..style = PaintingStyle.stroke;

      final path = Path();
      bool started = false;
      int steps = (size.width * 2).toInt();

      for (int j = 0; j <= steps; j++) {
        double x = xMin + (xMax - xMin) * j / steps;
        double y = func(x);

        if (y.isFinite && !y.isNaN) {
          double sx = _toScreenX(x, size.width);
          double sy = _toScreenY(y, size.height);

          if (!started) {
            path.moveTo(sx, sy);
            started = true;
          } else {
            path.lineTo(sx, sy);
          }
        } else {
          started = false;
        }
      }
      canvas.drawPath(path, paint);
    }
  }

  double _toScreenX(double x, double width) => (x - xMin) / (xMax - xMin) * width;
  double _toScreenY(double y, double height) => height - (y - yMin) / (yMax - yMin) * height;

  double _getGridStep(double range) {
    double rough = range / 8;
    double pow = 1;
    while (pow * 10 < rough) pow *= 10;
    while (pow > rough) pow /= 10;
    if (rough / pow >= 5) return pow * 5;
    if (rough / pow >= 2) return pow * 2;
    return pow;
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
