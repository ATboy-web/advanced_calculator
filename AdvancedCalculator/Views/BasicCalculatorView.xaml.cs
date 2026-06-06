using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using AdvancedCalculator.Models;
using AdvancedCalculator.Services;

namespace AdvancedCalculator.Views
{
    public partial class BasicCalculatorView : UserControl
    {
        private string _expression = "";
        private string _currentInput = "0";
        private string _pendingOp = "";
        private double _pendingValue = 0;
        private bool _newInput = true;
        private readonly MathEngine _engine = new();

        public static event Action<CalculationHistory>? OnCalculation;

        public BasicCalculatorView()
        {
            InitializeComponent();
            UpdateDisplay();
        }

        private void UpdateDisplay()
        {
            ExpressionDisplay.Text = _expression;
            ResultDisplay.Text = _currentInput;
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
                    _ => current
                };
            }
            else
            {
                _pendingValue = current;
            }
        }

        private void Equals_Click(object sender, RoutedEventArgs e)
        {
            if (!_newInput) CalculateIntermediate();
            string fullExpr = _expression + _currentInput;
            _currentInput = FormatResult(_pendingValue);
            OnCalculation?.Invoke(new CalculationHistory { Expression = fullExpr, Result = _currentInput });
            _expression = "";
            _pendingOp = "";
            _newInput = true;
            UpdateDisplay();
        }

        private void Clear_Click(object sender, RoutedEventArgs e)
        {
            _expression = ""; _currentInput = "0"; _pendingOp = ""; _pendingValue = 0; _newInput = true;
            UpdateDisplay();
        }

        private void Backspace_Click(object sender, RoutedEventArgs e)
        {
            if (!_newInput && _currentInput.Length > 1)
                _currentInput = _currentInput[..^1];
            else
                _currentInput = "0";
            UpdateDisplay();
        }

        private void Percent_Click(object sender, RoutedEventArgs e)
        {
            double val = double.Parse(_currentInput, CultureInfo.InvariantCulture);
            _currentInput = FormatResult(val / 100);
            _newInput = true;
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
