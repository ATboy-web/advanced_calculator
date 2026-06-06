import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/theme_provider.dart';

enum ConverterType {
  length,
  weight,
  temperature,
  area,
  volume,
  speed,
  data,
  time,
  base,
}

class ConverterScreen extends StatefulWidget {
  const ConverterScreen({super.key});

  @override
  State<ConverterScreen> createState() => _ConverterScreenState();
}

class _ConverterScreenState extends State<ConverterScreen> {
  ConverterType _currentType = ConverterType.length;
  final TextEditingController _inputController = TextEditingController(text: '1');
  String _result = '';
  
  // 单位数据
  final Map<ConverterType, List<String>> _units = {
    ConverterType.length: ['毫米', '厘米', '分米', '米', '千米', '英寸', '英尺', '码', '英里'],
    ConverterType.weight: ['毫克', '克', '千克', '吨', '盎司', '磅', '斤', '两'],
    ConverterType.temperature: ['摄氏度', '华氏度', '开尔文'],
    ConverterType.area: ['平方毫米', '平方厘米', '平方米', '公顷', '平方千米', '平方英尺', '亩'],
    ConverterType.volume: ['毫升', '升', '立方米', '加仑', '夸脱', '杯'],
    ConverterType.speed: ['米/秒', '千米/时', '英里/时', '节', '马赫'],
    ConverterType.data: ['字节', 'KB', 'MB', 'GB', 'TB'],
    ConverterType.time: ['毫秒', '秒', '分钟', '小时', '天', '周', '月', '年'],
    ConverterType.base: ['二进制', '八进制', '十进制', '十六进制'],
  };
  
  int _fromIndex = 0;
  int _toIndex = 1;

  @override
  void dispose() {
    _inputController.dispose();
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
          // 转换类型选择
          _buildTypeSelector(theme),
          const SizedBox(height: 24),
          // 转换面板
          _buildConverterPanel(theme),
        ],
      ),
    );
  }

  Widget _buildTypeSelector(ThemeProvider theme) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: _units.keys.map((type) {
        final isSelected = _currentType == type;
        return ChoiceChip(
          label: Text(_getTypeName(type)),
          selected: isSelected,
          selectedColor: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight,
          labelStyle: TextStyle(
            color: isSelected ? Colors.white : theme.textColor,
            fontSize: 12,
          ),
          onSelected: (selected) {
            if (selected) {
              setState(() {
                _currentType = type;
                _fromIndex = 0;
                _toIndex = _units[type]!.length > 1 ? 1 : 0;
                _convert();
              });
            }
          },
        );
      }).toList(),
    );
  }

  Widget _buildConverterPanel(ThemeProvider theme) {
    final units = _units[_currentType]!;
    
    return Card(
      color: theme.isDark ? const Color(0xFF16213E) : Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // 输入
            _buildField(
              label: '从',
              value: _inputController.text,
              unit: units[_fromIndex],
              units: units,
              onChanged: (value) {
                _inputController.text = value;
                _convert();
              },
              onUnitChanged: (index) {
                setState(() {
                  _fromIndex = index;
                  _convert();
                });
              },
              theme: theme,
              isInput: true,
            ),
            const SizedBox(height: 16),
            // 交换按钮
            IconButton(
              onPressed: _swapUnits,
              icon: Icon(
                Icons.swap_vert,
                color: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight,
                size: 32,
              ),
            ),
            const SizedBox(height: 16),
            // 输出
            _buildField(
              label: '到',
              value: _result,
              unit: units[_toIndex],
              units: units,
              onChanged: (_) {},
              onUnitChanged: (index) {
                setState(() {
                  _toIndex = index;
                  _convert();
                });
              },
              theme: theme,
              isInput: false,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildField({
    required String label,
    required String value,
    required String unit,
    required List<String> units,
    required ValueChanged<String> onChanged,
    required ValueChanged<int> onUnitChanged,
    required ThemeProvider theme,
    required bool isInput,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: theme.textSecondary,
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: isInput
                  ? TextField(
                      controller: _inputController,
                      keyboardType: TextInputType.number,
                      style: TextStyle(
                        color: theme.textColor,
                        fontSize: 20,
                      ),
                      decoration: InputDecoration(
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
                      onChanged: (_) => _convert(),
                    )
                  : Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        color: theme.displayBg,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: theme.borderColor),
                      ),
                      child: Text(
                        value.isEmpty ? '0' : value,
                        style: TextStyle(
                          color: theme.isDark ? ThemeProvider.primaryDark : ThemeProvider.primaryLight,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
            ),
            const SizedBox(width: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                border: Border.all(color: theme.borderColor),
                borderRadius: BorderRadius.circular(12),
              ),
              child: DropdownButton<int>(
                value: _fromIndex < units.length ? _fromIndex : 0,
                items: units.asMap().entries.map((entry) {
                  return DropdownMenuItem(
                    value: entry.key,
                    child: Text(
                      entry.value,
                      style: TextStyle(color: theme.textColor),
                    ),
                  );
                }).toList(),
                onChanged: (index) {
                  if (index != null) onUnitChanged(index);
                },
                underline: const SizedBox(),
                dropdownColor: theme.isDark ? const Color(0xFF16213E) : Colors.white,
              ),
            ),
          ],
        ),
      ],
    );
  }

  String _getTypeName(ConverterType type) {
    switch (type) {
      case ConverterType.length: return '长度';
      case ConverterType.weight: return '重量';
      case ConverterType.temperature: return '温度';
      case ConverterType.area: return '面积';
      case ConverterType.volume: return '体积';
      case ConverterType.speed: return '速度';
      case ConverterType.data: return '数据';
      case ConverterType.time: return '时间';
      case ConverterType.base: return '进制';
    }
  }

  void _swapUnits() {
    setState(() {
      final temp = _fromIndex;
      _fromIndex = _toIndex;
      _toIndex = temp;
      _convert();
    });
  }

  void _convert() {
    final input = double.tryParse(_inputController.text) ?? 0;
    double result;
    
    switch (_currentType) {
      case ConverterType.length:
        result = _convertLength(input, _fromIndex, _toIndex);
        break;
      case ConverterType.weight:
        result = _convertWeight(input, _fromIndex, _toIndex);
        break;
      case ConverterType.temperature:
        result = _convertTemperature(input, _fromIndex, _toIndex);
        break;
      case ConverterType.area:
        result = _convertArea(input, _fromIndex, _toIndex);
        break;
      case ConverterType.volume:
        result = _convertVolume(input, _fromIndex, _toIndex);
        break;
      case ConverterType.speed:
        result = _convertSpeed(input, _fromIndex, _toIndex);
        break;
      case ConverterType.data:
        result = _convertData(input, _fromIndex, _toIndex);
        break;
      case ConverterType.time:
        result = _convertTime(input, _fromIndex, _toIndex);
        break;
      case ConverterType.base:
        _convertBase(input);
        return;
    }
    
    setState(() {
      _result = _formatNumber(result);
    });
  }

  void _convertBase(double input) {
    final bases = [2, 8, 10, 16];
    final num = input.round();
    final decimal = int.parse(num.toString(), radix: bases[_fromIndex]);
    final result = decimal.toRadixString(bases[_toIndex]).toUpperCase();
    setState(() => _result = result);
  }

  double _convertLength(double value, int from, int to) {
    // 转换为米
    final toMeters = [0.001, 0.01, 0.1, 1.0, 1000.0, 0.0254, 0.3048, 0.9144, 1609.344];
    final meters = value * toMeters[from];
    return meters / toMeters[to];
  }

  double _convertWeight(double value, int from, int to) {
    final toKg = [0.000001, 0.001, 1.0, 1000.0, 0.0283495, 0.453592, 0.5, 0.05];
    final kg = value * toKg[from];
    return kg / toKg[to];
  }

  double _convertTemperature(double value, int from, int to) {
    // 先转换为摄氏度
    double celsius;
    switch (from) {
      case 0: celsius = value; break;
      case 1: celsius = (value - 32) * 5 / 9; break;
      case 2: celsius = value - 273.15; break;
      default: celsius = value;
    }
    
    // 从摄氏度转换为目标单位
    switch (to) {
      case 0: return celsius;
      case 1: return celsius * 9 / 5 + 32;
      case 2: return celsius + 273.15;
      default: return celsius;
    }
  }

  double _convertArea(double value, int from, int to) {
    final toSqm = [1e-6, 1e-4, 1.0, 1e4, 1e6, 0.092903, 666.667];
    final sqm = value * toSqm[from];
    return sqm / toSqm[to];
  }

  double _convertVolume(double value, int from, int to) {
    final toLiter = [0.001, 1.0, 1000.0, 3.78541, 0.946353, 0.236588];
    final liter = value * toLiter[from];
    return liter / toLiter[to];
  }

  double _convertSpeed(double value, int from, int to) {
    final toMs = [1.0, 0.277778, 0.44704, 0.514444, 340.3];
    final ms = value * toMs[from];
    return ms / toMs[to];
  }

  double _convertData(double value, int from, int to) {
    final toByte = [1.0, 1024.0, 1048576.0, 1073741824.0, 1099511627776.0];
    final bytes = value * toByte[from];
    return bytes / toByte[to];
  }

  double _convertTime(double value, int from, int to) {
    final toSecond = [0.001, 1.0, 60.0, 3600.0, 86400.0, 604800.0, 2592000.0, 31536000.0];
    final seconds = value * toSecond[from];
    return seconds / toSecond[to];
  }

  String _formatNumber(double num) {
    if (num == num.roundToDouble() && num.abs() < 1e15) {
      return num.round().toString();
    }
    return num.toStringAsPrecision(10).replaceAll(RegExp(r'0+$'), '').replaceAll(RegExp(r'\.$'), '');
  }
}