using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using AdvancedCalculator.Models;
using AdvancedCalculator.Services;

namespace AdvancedCalculator.Views
{
    public partial class ScientificCalculatorView : UserControl
    {
        private string _expression = "";
        private string _currentInput = "0";
        private string _pendingOp = "";
        private double _pendingValue = 0;
        private bool _newInput = true;
        private bool _shift = false;
        private readonly MathEngine _engine = new();

        public static event Action<CalculationHistory>? OnCalculation;

        public ScientificCalculatorView()
        {
            InitializeComponent();
            UpdateDisplay();
        }

        private void UpdateDisplay()
        {
            SciExpression.Text = _expression;
            SciResult.Text = _currentInput;
        }

        private void Digit_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn)
            {
                string digit = btn.Content.ToString()!;
                if (_newInput) { _currentInput = digit; _newInput = false; }
                else _currentInput += digit;
                if (_currentInput.Length > 1 && _currentInput.StartsWith("0") && !_currentInput.StartsWith("0."))
                    _currentInput = _currentInput.TrimStart('0');
                if (_currentInput == "") _currentInput = "0";
                UpdateDisplay();
            }
        }

        private void Decimal_Click(object sender, RoutedEventArgs e)
        {
            if (_newInput) { _currentInput = "0."; _newInput = false; }
            else if (!_currentInput.Contains('.')) _currentInput += ".";
            UpdateDisplay();
        }

        private void Operator_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn)
            {
                string op = btn.Tag?.ToString() ?? btn.Content.ToString()!;
                if (!_newInput) CalculateIntermediate();
                _pendingOp = op;
                _expression = _currentInput + " " + op + " ";
                _newInput = true;
                UpdateDisplay();
            }
        }

        private void CalculateIntermediate()
        {
            double current = double.Parse(_currentInput, CultureInfo.InvariantCulture);
            if (_pendingOp != "")
            {
                _pendingValue = _pendingOp switch
                {
                    "+" => _pendingValue + current,
                    "-" => _pendingValue - current,
                    "*" => _pendingValue * current,
                    "/" => current != 0 ? _pendingValue / current : double.NaN,
                    "^" => Math.Pow(_pendingValue, current),
                    _ => current
                };
            }
            else _pendingValue = current;
        }

        private void Equals_Click(object sender, RoutedEventArgs e)
        {
            if (!_newInput) CalculateIntermediate();
            string fullExpr = _expression + _currentInput;
            _currentInput = FormatResult(_pendingValue);
            OnCalculation?.Invoke(new CalculationHistory { Expression = fullExpr, Result = _currentInput });
            _expression = ""; _pendingOp = ""; _newInput = true;
            UpdateDisplay();
        }

        private void Clear_Click(object sender, RoutedEventArgs e)
        {
            _expression = ""; _currentInput = "0"; _pendingOp = ""; _pendingValue = 0; _newInput = true;
            UpdateDisplay();
        }

        private void Backspace_Click(object sender, RoutedEventArgs e)
        {
            if (!_newInput && _currentInput.Length > 1) _currentInput = _currentInput[..^1];
            else _currentInput = "0";
            UpdateDisplay();
        }

        private void Percent_Click(object sender, RoutedEventArgs e)
        {
            double val = double.Parse(_currentInput, CultureInfo.InvariantCulture);
            _currentInput = FormatResult(val / 100); _newInput = true;
            UpdateDisplay();
        }

        private void Negate_Click(object sender, RoutedEventArgs e)
        {
            if (_currentInput != "0")
            {
                if (_currentInput.StartsWith("-")) _currentInput = _currentInput[1..];
                else _currentInput = "-" + _currentInput;
                UpdateDisplay();
            }
        }

        private void Func_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn)
            {
                string func = btn.Tag.ToString()!;
                if (_shift)
                {
                    func = func switch
                    {
                        "sin" => "asin", "cos" => "acos", "tan" => "atan",
                        "ln" => "exp", "log" => "10^",
                        _ => func
                    };
                    _shift = false;
                    ShiftMode.Text = "";
                }
                double val = double.Parse(_currentInput, CultureInfo.InvariantCulture);
                _expression = $"{func}({val})";
                _currentInput = FormatResult(_engine.Evaluate($"{func}({val})"));
                _newInput = true;
                UpdateDisplay();
            }
        }

        private void Square_Click(object sender, RoutedEventArgs e)
        {
            double val = double.Parse(_currentInput, CultureInfo.InvariantCulture);
            _expression = $"({val})²";
            _currentInput = FormatResult(val * val); _newInput = true;
            UpdateDisplay();
        }

        private void Reciprocal_Click(object sender, RoutedEventArgs e)
        {
            double val = double.Parse(_currentInput, CultureInfo.InvariantCulture);
            _expression = $"1/({val})";
            _currentInput = FormatResult(val != 0 ? 1.0 / val : double.NaN); _newInput = true;
            UpdateDisplay();
        }

        private void Factorial_Click(object sender, RoutedEventArgs e)
        {
            double val = double.Parse(_currentInput, CultureInfo.InvariantCulture);
            _expression = $"{val}!";
            _currentInput = FormatResult(MathEngine.Factorial(val)); _newInput = true;
            UpdateDisplay();
        }

        private void Exp_Click(object sender, RoutedEventArgs e)
        {
            double val = double.Parse(_currentInput, CultureInfo.InvariantCulture);
            _expression = $"e^({val})";
            _currentInput = FormatResult(Math.Exp(val)); _newInput = true;
            UpdateDisplay();
        }

        private void Constant_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn)
            {
                string c = btn.Tag.ToString()!;
                _currentInput = c == "pi" ? FormatResult(Math.PI) : FormatResult(Math.E);
                _newInput = true;
                UpdateDisplay();
            }
        }

        private void Paren_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn)
            {
                string p = btn.Tag.ToString()!;
                if (_newInput) { _currentInput = p; _newInput = false; }
                else _currentInput += p;
                UpdateDisplay();
            }
        }

        private void Shift_Click(object sender, RoutedEventArgs e)
        {
            _shift = !_shift;
            ShiftMode.Text = _shift ? "2nd" : "";
            BtnSin.Content = _shift ? "sin⁻¹" : "sin";
            BtnCos.Content = _shift ? "cos⁻¹" : "cos";
            BtnTan.Content = _shift ? "tan⁻¹" : "tan";
            BtnLn.Content = _shift ? "eˣ" : "ln";
            BtnLog.Content = _shift ? "10ˣ" : "log";
        }

        private void Angle_Click(object sender, RoutedEventArgs e)
        {
            _engine.UseDegrees = !_engine.UseDegrees;
            BtnAngle.Content = _engine.UseDegrees ? "DEG" : "RAD";
            AngleMode.Text = _engine.UseDegrees ? "DEG" : "RAD";
        }

        private string FormatResult(double val)
        {
            if (double.IsNaN(val)) return "错误";
            if (double.IsInfinity(val)) return "∞";
            if (val == Math.Floor(val) && Math.Abs(val) < 1e15)
                return val.ToString("0", CultureInfo.InvariantCulture);
            return val.ToString("G12", CultureInfo.InvariantCulture);
        }
    }
}
