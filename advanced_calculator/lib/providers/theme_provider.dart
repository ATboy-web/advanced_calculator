import 'package:flutter/material.dart';

class ThemeProvider with ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.dark;
  
  ThemeMode get themeMode => _themeMode;
  bool get isDark => _themeMode == ThemeMode.dark;

  void toggleTheme() {
    _themeMode = _themeMode == ThemeMode.dark 
        ? ThemeMode.light 
        : ThemeMode.dark;
    notifyListeners();
  }

  ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: ColorScheme.dark(
        primary: const Color(0xFF4FC3F7),
        secondary: const Color(0xFF81C784),
        tertiary: const Color(0xFFFFB74D),
        surface: const Color(0xFF1A1A2E),
        background: const Color(0xFF0F0F1A),
        error: const Color(0xFFEF5350),
      ),
      scaffoldBackgroundColor: const Color(0xFF1A1A2E),
      cardColor: const Color(0xFF16213E),
      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xFF16213E),
        elevation: 0,
      ),
      textTheme: const TextTheme(
        displayLarge: TextStyle(color: Colors.white, fontWeight: FontWeight.w300),
        bodyLarge: TextStyle(color: Colors.white70),
        bodyMedium: TextStyle(color: Colors.white60),
      ),
    );
  }

  ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: ColorScheme.light(
        primary: const Color(0xFF1976D2),
        secondary: const Color(0xFF388E3C),
        tertiary: const Color(0xFFF57C00),
        surface: Colors.white,
        background: const Color(0xFFF5F5F5),
        error: const Color(0xFFD32F2F),
      ),
      scaffoldBackgroundColor: const Color(0xFFF5F5F5),
      cardColor: Colors.white,
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black,
      ),
      textTheme: const TextTheme(
        displayLarge: TextStyle(color: Color(0xFF1A237E), fontWeight: FontWeight.w300),
        bodyLarge: TextStyle(color: Colors.black87),
        bodyMedium: TextStyle(color: Colors.black54),
      ),
    );
  }

  // 颜色常量
  static const Color primaryDark = Color(0xFF4FC3F7);
  static const Color primaryLight = Color(0xFF1976D2);
  static const Color accentGreen = Color(0xFF81C784);
  static const Color accentOrange = Color(0xFFFFB74D);
  static const Color accentRed = Color(0xFFEF5350);
  
  Color get displayBg => isDark ? const Color(0xFF0A0A1A) : const Color(0xFFE8EAF6);
  Color get keypadBg => isDark ? const Color(0xFF1A1A2E) : const Color(0xFFF0F0F0);
  Color get btnNumber => isDark ? const Color(0xFF2D2D44) : const Color(0xFFE0E0E0);
  Color get btnOperator => isDark ? const Color(0xFF4A6FA5) : const Color(0xFF42A5F5);
  Color get btnFunction => isDark ? const Color(0xFF3D3D5C) : const Color(0xFFBDBDBD);
  Color get btnEqual => isDark ? const Color(0xFF4FC3F7) : const Color(0xFF1976D2);
  Color get btnScientific => isDark ? const Color(0xFF2A2A42) : const Color(0xFFE8EAF6);
  Color get textColor => isDark ? Colors.white : Colors.black87;
  Color get textSecondary => isDark ? Colors.white60 : Colors.black54;
  Color get borderColor => isDark ? const Color(0xFF333355) : const Color(0xFFCCCCCC);
  Color get sidebarBg => isDark ? const Color(0xFF12122A) : const Color(0xFFFAFAFA);
}