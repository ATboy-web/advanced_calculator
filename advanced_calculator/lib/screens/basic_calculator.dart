import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/calculator_provider.dart';
import '../providers/theme_provider.dart';
import '../widgets/calculator_button.dart';
import '../widgets/display_panel.dart';

class BasicCalculator extends StatelessWidget {
  const BasicCalculator({super.key});

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
        // 按钮键盘
        Expanded(
          flex: 5,
          child: Container(
            padding: const EdgeInsets.all(8),
            child: Column(
              children: [
                // 第一行: AC, ⌫, %, ÷
                Expanded(
                  child: Row(
                    children: [
                      CalculatorButton(
                        text: 'AC',
                        type: ButtonType.function,
                        onPressed: () => calculator.clear(),
                      ),
                      CalculatorButton(
                        icon: Icons.backspace_outlined,
                        type: ButtonType.function,
                        onPressed: () => calculator.backspace(),
                      ),
                      CalculatorButton(
                        text: '%',
                        type: ButtonType.function,
                        onPressed: () => calculator.percent(),
                      ),
                      CalculatorButton(
                        text: '÷',
                        type: ButtonType.operator,
                        onPressed: () => calculator.inputOperator('divide'),
                      ),
                    ],
                  ),
                ),
                // 第二行: 7, 8, 9, ×
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
                        text: '×',
                        type: ButtonType.operator,
                        onPressed: () => calculator.inputOperator('multiply'),
                      ),
                    ],
                  ),
                ),
                // 第三行: 4, 5, 6, −
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
                        text: '−',
                        type: ButtonType.operator,
                        onPressed: () => calculator.inputOperator('subtract'),
                      ),
                    ],
                  ),
                ),
                // 第四行: 1, 2, 3, +
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
                        text: '+',
                        type: ButtonType.operator,
                        onPressed: () => calculator.inputOperator('add'),
                      ),
                    ],
                  ),
                ),
                // 第五行: ±, 0, ., =
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
}