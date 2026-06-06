using System;
using System.Collections.Generic;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;

namespace AdvancedCalculator.Views
{
    public partial class UnitConverterView : UserControl
    {
        private string _currentCategory = "Length";
        private static readonly Dictionary<string, string[]> _units = new()
        {
            ["Length"] = new[] { "米(m)", "千米(km)", "厘米(cm)", "毫米(mm)", "英里(mi)", "英尺(ft)", "英寸(in)", "码(yd)" },
            ["Weight"] = new[] { "千克(kg)", "克(g)", "毫克(mg)", "吨(t)", "磅(lb)", "盎司(oz)" },
            ["Temp"] = new[] { "摄氏度(°C)", "华氏度(°F)", "开尔文(K)" },
            ["Area"] = new[] { "平方米(m²)", "平方千米(km²)", "公顷(ha)", "平方英里(mi²)", "英亩", "平方英尺(ft²)" },
            ["Volume"] = new[] { "升(L)", "毫升(mL)", "立方米(m³)", "加仑(gal)", "夸脱(qt)", "杯(cup)" },
            ["Speed"] = new[] { "米/秒(m/s)", "千米/时(km/h)", "英里/时(mph)", "节(kn)", "马赫(Ma)" },
            ["Data"] = new[] { "字节(B)", "KB", "MB", "GB", "TB", "PB" },
            ["Base"] = new[] { "十进制", "二进制", "八进制", "十六进制" },
        };

        public UnitConverterView()
        {
            InitializeComponent();
            LoadCategory("Length");
        }

        private void Category_Changed(object sender, RoutedEventArgs e)
        {
            if (sender is RadioButton rb && rb.Tag is string tag)
            {
                _currentCategory = tag;
                LoadCategory(tag);
            }
        }

        private void LoadCategory(string cat)
        {
            FromUnit.Items.Clear();
            ToUnit.Items.Clear();
            if (_units.TryGetValue(cat, out var units))
            {
                foreach (var u in units) { FromUnit.Items.Add(u); ToUnit.Items.Add(u); }
                FromUnit.SelectedIndex = 0;
                ToUnit.SelectedIndex = units.Length > 1 ? 1 : 0;
            }
        }

        private void Value_Changed(object sender, TextChangedEventArgs e) => Convert();
        private void Unit_Changed(object sender, SelectionChangedEventArgs e) => Convert();

        private void Convert()
        {
            if (FromUnit.SelectedIndex < 0 || ToUnit.SelectedIndex < 0) return;
            if (!double.TryParse(FromValue.Text, NumberStyles.Any, CultureInfo.InvariantCulture, out double val))
            {
                ToValue.Text = "输入无效";
                return;
            }

            if (_currentCategory == "Base")
            {
                ConvertBase(val);
                return;
            }

            double result = _currentCategory switch
            {
                "Length" => ConvertLength(val, FromUnit.SelectedIndex, ToUnit.SelectedIndex),
                "Weight" => ConvertWeight(val, FromUnit.SelectedIndex, ToUnit.SelectedIndex),
                "Temp" => ConvertTemp(val, FromUnit.SelectedIndex, ToUnit.SelectedIndex),
                "Area" => ConvertArea(val, FromUnit.SelectedIndex, ToUnit.SelectedIndex),
                "Volume" => ConvertVolume(val, FromUnit.SelectedIndex, ToUnit.SelectedIndex),
                "Speed" => ConvertSpeed(val, FromUnit.SelectedIndex, ToUnit.SelectedIndex),
                "Data" => ConvertData(val, FromUnit.SelectedIndex, ToUnit.SelectedIndex),
                _ => val
            };

            ToValue.Text = FormatResult(result);
            ShowFormula();
        }

        private void ConvertBase(double val)
        {
            int fromBase = FromUnit.SelectedIndex switch { 0 => 10, 1 => 2, 2 => 8, 3 => 16, _ => 10 };
            int toBase = ToUnit.SelectedIndex switch { 0 => 10, 1 => 2, 2 => 8, 3 => 16, _ => 10 };

            try
            {
                long num;
                if (FromValue.Text.StartsWith("0x", StringComparison.OrdinalIgnoreCase))
                    num = Convert.ToInt64(FromValue.Text[2..], 16);
                else
                    num = Convert.ToInt64((long)val, fromBase);

                string result = Convert.ToString(num, toBase).ToUpper();
                if (toBase == 16) result = "0x" + result;
                else if (toBase == 2) result = "0b" + result;
                else if (toBase == 8) result = "0o" + result;
                ToValue.Text = result;
            }
            catch
            {
                ToValue.Text = "转换错误";
            }
        }

        private static double ConvertLength(double v, int from, int to)
        {
            double[] toM = { 1, 1000, 0.01, 0.001, 1609.344, 0.3048, 0.0254, 0.9144 };
            return v * toM[from] / toM[to];
        }

        private static double ConvertWeight(double v, int from, int to)
        {
            double[] toKg = { 1, 0.001, 0.000001, 1000, 0.453592, 0.0283495 };
            return v * toKg[from] / toKg[to];
        }

        private static double ConvertTemp(double v, int from, int to)
        {
            // Convert to Celsius first
            double c = from switch { 0 => v, 1 => (v - 32) * 5 / 9, 2 => v - 273.15, _ => v };
            return to switch { 0 => c, 1 => c * 9 / 5 + 32, 2 => c + 273.15, _ => c };
        }

        private static double ConvertArea(double v, int from, int to)
        {
            double[] toM2 = { 1, 1e6, 10000, 2589988.11, 4046.86, 0.092903 };
            return v * toM2[from] / toM2[to];
        }

        private static double ConvertVolume(double v, int from, int to)
        {
            double[] toL = { 1, 0.001, 1000, 3.78541, 0.946353, 0.236588 };
            return v * toL[from] / toL[to];
        }

        private static double ConvertSpeed(double v, int from, int to)
        {
            double[] toMs = { 1, 1 / 3.6, 0.44704, 0.514444, 340.3 };
            return v * toMs[from] / toMs[to];
        }

        private static double ConvertData(double v, int from, int to)
        {
            double[] toB = { 1, 1024, 1048576, 1073741824, 1099511627776, 1125899906842624 };
            return v * toB[from] / toB[to];
        }

        private void Swap_Click(object sender, RoutedEventArgs e)
        {
            int fi = FromUnit.SelectedIndex, ti = ToUnit.SelectedIndex;
            FromUnit.SelectedIndex = ti;
            ToUnit.SelectedIndex = fi;
        }

        private void ShowFormula()
        {
            if (FromUnit.SelectedIndex >= 0 && ToUnit.SelectedIndex >= 0)
            {
                string from = _units[_currentCategory][FromUnit.SelectedIndex];
                string to = _units[_currentCategory][ToUnit.SelectedIndex];
                InfoText.Text = $"转换: {from} → {to}\n\n1 {from} = {FormatResult(_currentCategory == "Temp" ? ConvertTemp(1, FromUnit.SelectedIndex, ToUnit.SelectedIndex) : GetFactor(from, to))} {to}";
            }
        }

        private double GetFactor(string from, string to)
        {
            if (!_units.TryGetValue(_currentCategory, out var units)) return 1;
            int fi = Array.IndexOf(units, from), ti = Array.IndexOf(units, to);
            return _currentCategory switch
            {
                "Length" => ConvertLength(1, fi, ti),
                "Weight" => ConvertWeight(1, fi, ti),
                "Area" => ConvertArea(1, fi, ti),
                "Volume" => ConvertVolume(1, fi, ti),
                "Speed" => ConvertSpeed(1, fi, ti),
                "Data" => ConvertData(1, fi, ti),
                _ => 1
            };
        }

        private static string FormatResult(double v)
        {
            if (double.IsNaN(v) || double.IsInfinity(v)) return "错误";
            if (v == Math.Floor(v) && Math.Abs(v) < 1e15) return v.ToString("0", CultureInfo.InvariantCulture);
            return v.ToString("G10", CultureInfo.InvariantCulture);
        }
    }
}
