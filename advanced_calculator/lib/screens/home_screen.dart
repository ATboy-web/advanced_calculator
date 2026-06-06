import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/calculator_provider.dart';
import '../providers/theme_provider.dart';
import 'basic_calculator.dart';
import 'scientific_calculator.dart';
import 'graphing_screen.dart';
import 'equation_solver.dart';
import 'converter_screen.dart';
import 'history_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final calculatorProvider = Provider.of<CalculatorProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    
    return Scaffold(
      appBar: AppBar(
        title: Text(_getTitle(calculatorProvider.currentMode)),
        leading: Builder(
          builder: (context) => IconButton(
            icon: const Icon(Icons.menu),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(themeProvider.isDark ? Icons.light_mode : Icons.dark_mode),
            onPressed: () => themeProvider.toggleTheme(),
          ),
        ],
      ),
      drawer: _buildDrawer(context, calculatorProvider, themeProvider),
      body: _buildBody(calculatorProvider.currentMode),
    );
  }

  String _getTitle(CalculatorMode mode) {
    switch (mode) {
      case CalculatorMode.basic:
        return '基础计算';
      case CalculatorMode.scientific:
        return '科学计算';
      case CalculatorMode.graphing:
        return '函数绘图';
      case CalculatorMode.equation:
        return '方程求解';
      case CalculatorMode.converter:
        return '单位转换';
      case CalculatorMode.history:
        return '历史记录';
    }
  }

  Widget _buildBody(CalculatorMode mode) {
    switch (mode) {
      case CalculatorMode.basic:
        return const BasicCalculator();
      case CalculatorMode.scientific:
        return const ScientificCalculator();
      case CalculatorMode.graphing:
        return const GraphingScreen();
      case CalculatorMode.equation:
        return const EquationSolver();
      case CalculatorMode.converter:
        return const ConverterScreen();
      case CalculatorMode.history:
        return const HistoryScreen();
    }
  }

  Widget _buildDrawer(
    BuildContext context,
    CalculatorProvider calculatorProvider,
    ThemeProvider themeProvider,
  ) {
    return Drawer(
      child: Column(
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: themeProvider.isDark 
                  ? const Color(0xFF16213E) 
                  : themeProvider.primaryLight,
            ),
            child: const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.calculate, size: 48, color: Colors.white),
                  SizedBox(height: 8),
                  Text(
                    '高级计算器',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
          _buildNavItem(
            context,
            icon: Icons.calculate,
            title: '基础计算',
            mode: CalculatorMode.basic,
            currentMode: calculatorProvider.currentMode,
            onTap: () {
              calculatorProvider.switchMode(CalculatorMode.basic);
              Navigator.pop(context);
            },
          ),
          _buildNavItem(
            context,
            icon: Icons.science,
            title: '科学计算',
            mode: CalculatorMode.scientific,
            currentMode: calculatorProvider.currentMode,
            onTap: () {
              calculatorProvider.switchMode(CalculatorMode.scientific);
              Navigator.pop(context);
            },
          ),
          _buildNavItem(
            context,
            icon: Icons.show_chart,
            title: '函数绘图',
            mode: CalculatorMode.graphing,
            currentMode: calculatorProvider.currentMode,
            onTap: () {
              calculatorProvider.switchMode(CalculatorMode.graphing);
              Navigator.pop(context);
            },
          ),
          _buildNavItem(
            context,
            icon: Icons.functions,
            title: '方程求解',
            mode: CalculatorMode.equation,
            currentMode: calculatorProvider.currentMode,
            onTap: () {
              calculatorProvider.switchMode(CalculatorMode.equation);
              Navigator.pop(context);
            },
          ),
          _buildNavItem(
            context,
            icon: Icons.swap_horiz,
            title: '单位转换',
            mode: CalculatorMode.converter,
            currentMode: calculatorProvider.currentMode,
            onTap: () {
              calculatorProvider.switchMode(CalculatorMode.converter);
              Navigator.pop(context);
            },
          ),
          _buildNavItem(
            context,
            icon: Icons.history,
            title: '历史记录',
            mode: CalculatorMode.history,
            currentMode: calculatorProvider.currentMode,
            onTap: () {
              calculatorProvider.switchMode(CalculatorMode.history);
              Navigator.pop(context);
            },
          ),
          const Spacer(),
          const Divider(),
          ListTile(
            leading: Icon(
              themeProvider.isDark ? Icons.light_mode : Icons.dark_mode,
              color: themeProvider.isDark 
                  ? ThemeProvider.primaryDark 
                  : ThemeProvider.primaryLight,
            ),
            title: Text(themeProvider.isDark ? '亮色主题' : '暗色主题'),
            onTap: () {
              themeProvider.toggleTheme();
              Navigator.pop(context);
            },
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildNavItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required CalculatorMode mode,
    required CalculatorMode currentMode,
    required VoidCallback onTap,
  }) {
    final isSelected = mode == currentMode;
    final themeProvider = Provider.of<ThemeProvider>(context, listen: false);
    
    return ListTile(
      leading: Icon(
        icon,
        color: isSelected 
            ? (themeProvider.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight)
            : null,
      ),
      title: Text(
        title,
        style: TextStyle(
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          color: isSelected 
              ? (themeProvider.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight)
              : null,
        ),
      ),
      selected: isSelected,
      selectedTileColor: themeProvider.isDark 
          ? const Color(0xFF1A1A2E) 
          : const Color(0xFFE3F2FD),
      onTap: onTap,
    );
  }
}