import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/calculator_provider.dart';
import '../providers/theme_provider.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final calculator = Provider.of<CalculatorProvider>(context);
    final theme = Provider.of<ThemeProvider>(context);
    
    if (calculator.history.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.history,
              size: 64,
              color: theme.textSecondary,
            ),
            const SizedBox(height: 16),
            Text(
              '暂无计算历史',
              style: TextStyle(
                fontSize: 18,
                color: theme.textSecondary,
              ),
            ),
          ],
        ),
      );
    }
    
    return Column(
      children: [
        // 清空按钮
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '计算历史',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: theme.textColor,
                ),
              ),
              TextButton.icon(
                onPressed: () => _showClearDialog(context, calculator),
                icon: const Icon(Icons.delete_outline, color: ThemeProvider.accentRed),
                label: const Text(
                  '清空历史',
                  style: TextStyle(color: ThemeProvider.accentRed),
                ),
              ),
            ],
          ),
        ),
        // 历史列表
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: calculator.history.length,
            itemBuilder: (context, index) {
              final item = calculator.history[index];
              return _buildHistoryItem(context, item, calculator, theme);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildHistoryItem(
    BuildContext context,
    dynamic item,
    CalculatorProvider calculator,
    ThemeProvider theme,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      color: theme.isDark ? const Color(0xFF16213E) : Colors.white,
      child: InkWell(
        onTap: () => calculator.useHistory(item),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              // 表达式
              Text(
                item.expression,
                style: TextStyle(
                  fontSize: 14,
                  color: theme.textSecondary,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              // 结果
              Text(
                '= ${item.result}',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight,
                ),
              ),
              // 时间
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  _formatTime(item.timestamp),
                  style: TextStyle(
                    fontSize: 12,
                    color: theme.textSecondary,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatTime(DateTime time) {
    final now = DateTime.now();
    final diff = now.difference(time);
    
    if (diff.inMinutes < 1) {
      return '刚刚';
    } else if (diff.inHours < 1) {
      return '${diff.inMinutes} 分钟前';
    } else if (diff.inDays < 1) {
      return '${diff.inHours} 小时前';
    } else if (diff.inDays < 7) {
      return '${diff.inDays} 天前';
    } else {
      return '${time.month}/${time.day} ${time.hour}:${time.minute.toString().padLeft(2, '0')}';
    }
  }

  void _showClearDialog(BuildContext context, CalculatorProvider calculator) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('清空历史'),
        content: const Text('确定要清空所有计算历史吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () {
              calculator.clearHistory();
              Navigator.pop(context);
            },
            child: const Text(
              '清空',
              style: TextStyle(color: ThemeProvider.accentRed),
            ),
          ),
        ],
      ),
    );
  }
}