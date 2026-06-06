import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/theme_provider.dart';

enum ButtonType {
  number,
  operator,
  function,
  equal,
  scientific,
}

class CalculatorButton extends StatelessWidget {
  final String? text;
  final IconData? icon;
  final ButtonType type;
  final VoidCallback? onPressed;
  final bool isActive;
  
  const CalculatorButton({
    super.key,
    this.text,
    this.icon,
    required this.type,
    this.onPressed,
    this.isActive = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Provider.of<ThemeProvider>(context);
    
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(4),
        child: Material(
          color: _getBackgroundColor(theme),
          borderRadius: BorderRadius.circular(12),
          child: InkWell(
            onTap: onPressed,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              height: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                border: isActive 
                    ? Border.all(color: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight, width: 2)
                    : null,
              ),
              child: Center(
                child: icon != null
                    ? Icon(
                        icon,
                        color: _getTextColor(theme),
                        size: 24,
                      )
                    : Text(
                        text ?? '',
                        style: TextStyle(
                          fontSize: _getFontSize(),
                          fontWeight: _getFontWeight(),
                          color: _getTextColor(theme),
                        ),
                      ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Color _getBackgroundColor(ThemeProvider theme) {
    if (isActive) {
      return theme.isDark 
          ? ThemeProvider.primaryDark.withOpacity(0.3)
          : ThemeProvider.primaryLight.withOpacity(0.2);
    }
    
    switch (type) {
      case ButtonType.number:
        return theme.btnNumber;
      case ButtonType.operator:
        return theme.btnOperator;
      case ButtonType.function:
        return theme.btnFunction;
      case ButtonType.equal:
        return theme.btnEqual;
      case ButtonType.scientific:
        return theme.btnScientific;
    }
  }

  Color _getTextColor(ThemeProvider theme) {
    switch (type) {
      case ButtonType.number:
        return theme.textColor;
      case ButtonType.operator:
        return Colors.white;
      case ButtonType.function:
        return theme.textColor;
      case ButtonType.equal:
        return Colors.white;
      case ButtonType.scientific:
        return theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight;
    }
  }

  double _getFontSize() {
    if (text != null && text!.length > 2) return 14;
    switch (type) {
      case ButtonType.operator:
      case ButtonType.equal:
        return 28;
      case ButtonType.function:
        return 18;
      default:
        return 24;
    }
  }

  FontWeight _getFontWeight() {
    switch (type) {
      case ButtonType.operator:
      case ButtonType.equal:
        return FontWeight.bold;
      case ButtonType.function:
        return FontWeight.w500;
      default:
        return FontWeight.normal;
    }
  }
}