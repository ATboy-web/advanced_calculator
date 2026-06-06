import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/theme_provider.dart';

class DisplayPanel extends StatelessWidget {
  final String expression;
  final String result;
  
  const DisplayPanel({
    super.key,
    required this.expression,
    required this.result,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Provider.of<ThemeProvider>(context);
    
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      decoration: BoxDecoration(
        color: theme.displayBg,
        border: Border(
          bottom: BorderSide(
            color: theme.borderColor,
            width: 1,
          ),
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // 历史表达式
          if (expression.isNotEmpty)
            Container(
              width: double.infinity,
              child: Text(
                expression,
                style: TextStyle(
                  fontSize: 16,
                  color: theme.textSecondary,
                ),
                textAlign: TextAlign.right,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          const SizedBox(height: 8),
          // 当前显示
          Container(
            width: double.infinity,
            child: FittedBox(
              fit: BoxFit.scaleDown,
              alignment: Alignment.centerRight,
              child: Text(
                result,
                style: TextStyle(
                  fontSize: result.length > 12 ? 32 : 48,
                  fontWeight: FontWeight.w300,
                  color: theme.textColor,
                ),
                maxLines: 1,
              ),
            ),
          ),
        ],
      ),
    );
  }
}