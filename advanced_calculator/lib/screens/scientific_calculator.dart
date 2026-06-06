import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/calculator_provider.dart';
import '../providers/theme_provider.dart';
import '../widgets/calculator_button.dart';
import '../widgets/display_panel.dart';

class ScientificCalculator extends StatelessWidget {
  const ScientificCalculator({super.key});

  @override
  Widget build(BuildContext context) {
    final calculator = Provider.of<CalculatorProvider>(context);
    final theme = Provider.of<ThemeProvider>(context);
    
    return Column(
      children: [
        // 显示面板
        Expanded(
          flex: 2,
          child: DisplayPanel(
            expression: calculator.historyExpression,
            result: calculator.currentDisplay,
          ),
        ),
        // 模式切换
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: [
              _buildModeChip(
                context,
                label: calculator.isDegree ? 'DEG' : 'RAD',
                isActive: true,
                onTap: () => calculator.toggleAngleMode(),
              ),
              const SizedBox(width: 8),
              _buildModeChip(
                context,
                label: '2nd',
                isActive: calculator.isShifted,
                onTap: () => calculator.toggleShift(),
              ),
            ],
          ),
        ),
        // 科学计算键盘
        Expanded(
          flex: 6,
          child: Container(
            padding: const EdgeInsets.all(4),
            child: Column(
              children: [
                // 第一行: 2nd, π, e, x!, AC
                Expanded(
                  child: Row(
                    children: [
                      CalculatorButton(
                        text: '2nd',
                        type: ButtonType.scientific,
                        isActive: calculator.isShifted,
                        onPressed: () => calculator.toggleShift(),
                      ),
                      CalculatorButton(
                        text: 'π',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.insertConstant(calculator.mathEngine.pi, 'π'),
                      ),
                      CalculatorButton(
                        text: 'e',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.insertConstant(calculator.mathEngine.e, 'e'),
                      ),
                      CalculatorButton(
                        text: 'x!',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.applyFunction('factorial'),
                      ),
                      CalculatorButton(
                        text: 'AC',
                        type: ButtonType.function,
                        onPressed: () => calculator.clear(),
                      ),
                    ],
                  ),
                ),
                // 第二行: sin, cos, tan, x^y, ⌫
                Expanded(
                  child: Row(
                    children: [
                      CalculatorButton(
                        text: calculator.isShifted ? 'sin⁻¹' : 'sin',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.applyFunction(calculator.isShifted ? 'asin' : 'sin'),
                      ),
                      CalculatorButton(
                        text: calculator.isShifted ? 'cos⁻¹' : 'cos',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.applyFunction(calculator.isShifted ? 'acos' : 'cos'),
                      ),
                      CalculatorButton(
                        text: calculator.isShifted ? 'tan⁻¹' : 'tan',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.applyFunction(calculator.isShifted ? 'atan' : 'tan'),
                      ),
                      CalculatorButton(
                        text: 'x^y',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.inputOperator('power'),
                      ),
                      CalculatorButton(
                        icon: Icons.backspace_outlined,
                        type: ButtonType.function,
                        onPressed: () => calculator.backspace(),
                      ),
                    ],
                  ),
                ),
                // 第三行: ln, log, √, ∛, %
                Expanded(
                  child: Row(
                    children: [
                      CalculatorButton(
                        text: 'ln',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.applyFunction('ln'),
                      ),
                      CalculatorButton(
                        text: 'log',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.applyFunction('log'),
                      ),
                      CalculatorButton(
                        text: '√',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.applyFunction('sqrt'),
                      ),
                      CalculatorButton(
                        text: '∛',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.applyFunction('cbrt'),
                      ),
                      CalculatorButton(
                        text: '%',
                        type: ButtonType.function,
                        onPressed: () => calculator.percent(),
                      ),
                    ],
                  ),
                ),
                // 第四行: (, ), |x|, 1/x, ÷
                Expanded(
                  child: Row(
                    children: [
                      CalculatorButton(
                        text: '(',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.inputParen('('),
                      ),
                      CalculatorButton(
                        text: ')',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.inputParen(')'),
                      ),
                      CalculatorButton(
                        text: '|x|',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.applyFunction('abs'),
                      ),
                      CalculatorButton(
                        text: '1/x',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.applyFunction('inv'),
                      ),
                      CalculatorButton(
                        text: '÷',
                        type: ButtonType.operator,
                        onPressed: () => calculator.inputOperator('divide'),
                      ),
                    ],
                  ),
                ),
                // 第五行: 7, 8, 9, x², ×
                Expanded(
                  child: Row(
                    children: [
                      CalculatorButton(
                        text: '7',
                        type: ButtonType.number,
                        onPressed: () => calculator.inputDigit('7'),
                      ),
                      CalculatorButton(
                        text: '8',
                        type: ButtonType.number,
                        onPressed: () => calculator.inputDigit('8'),
                      ),
                      CalculatorButton(
                        text: '9',
                        type: ButtonType.number,
                        onPressed: () => calculator.inputDigit('9'),
                      ),
                      CalculatorButton(
                        text: 'x²',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.applyFunction('square'),
                      ),
                      CalculatorButton(
                        text: '×',
                        type: ButtonType.operator,
                        onPressed: () => calculator.inputOperator('multiply'),
                      ),
                    ],
                  ),
                ),
                // 第六行: 4, 5, 6, x³, −
                Expanded(
                  child: Row(
                    children: [
                      CalculatorButton(
                        text: '4',
                        type: ButtonType.number,
                        onPressed: () => calculator.inputDigit('4'),
                      ),
                      CalculatorButton(
                        text: '5',
                        type: ButtonType.number,
                        onPressed: () => calculator.inputDigit('5'),
                      ),
                      CalculatorButton(
                        text: '6',
                        type: ButtonType.number,
                        onPressed: () => calculator.inputDigit('6'),
                      ),
                      CalculatorButton(
                        text: 'x³',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.applyFunction('cube'),
                      ),
                      CalculatorButton(
                        text: '−',
                        type: ButtonType.operator,
                        onPressed: () => calculator.inputOperator('subtract'),
                      ),
                    ],
                  ),
                ),
                // 第七行: 1, 2, 3, e^x, +
                Expanded(
                  child: Row(
                    children: [
                      CalculatorButton(
                        text: '1',
                        type: ButtonType.number,
                        onPressed: () => calculator.inputDigit('1'),
                      ),
                      CalculatorButton(
                        text: '2',
                        type: ButtonType.number,
                        onPressed: () => calculator.inputDigit('2'),
                      ),
                      CalculatorButton(
                        text: '3',
                        type: ButtonType.number,
                        onPressed: () => calculator.inputDigit('3'),
                      ),
                      CalculatorButton(
                        text: 'e^x',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.applyFunction('exp'),
                      ),
                      CalculatorButton(
                        text: '+',
                        type: ButtonType.operator,
                        onPressed: () => calculator.inputOperator('add'),
                      ),
                    ],
                  ),
                ),
                // 第八行: ±, 0, ., 10^x, =
                Expanded(
                  child: Row(
                    children: [
                      CalculatorButton(
                        text: '±',
                        type: ButtonType.number,
                        onPressed: () => calculator.negate(),
                      ),
                      CalculatorButton(
                        text: '0',
                        type: ButtonType.number,
                        onPressed: () => calculator.inputDigit('0'),
                      ),
                      CalculatorButton(
                        text: '.',
                        type: ButtonType.number,
                        onPressed: () => calculator.inputDigit('.'),
                      ),
                      CalculatorButton(
                        text: '10^x',
                        type: ButtonType.scientific,
                        onPressed: () => calculator.applyFunction('tenPow'),
                      ),
                      CalculatorButton(
                        text: '=',
                        type: ButtonType.equal,
                        onPressed: () => calculator.calculate(),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildModeChip(
    BuildContext context, {
    required String label,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    final theme = Provider.of<ThemeProvider>(context);
    
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isActive 
              ? (theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight)
              : theme.btnScientific,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isActive ? Colors.white : theme.textColor,
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}