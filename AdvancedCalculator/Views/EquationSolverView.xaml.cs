using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using AdvancedCalculator.Services;

namespace AdvancedCalculator.Views
{
    public partial class EquationSolverView : UserControl
    {
        private readonly MathEngine _engine = new();

        public EquationSolverView()
        {
            InitializeComponent();
        }

        private void Type_Changed(object sender, RoutedEventArgs e)
        {
            LinearPanel.Visibility = RbLinear.IsChecked == true ? Visibility.Visible : Visibility.Collapsed;
            QuadraticPanel.Visibility = RbQuadratic.IsChecked == true ? Visibility.Visible : Visibility.Collapsed;
            SystemPanel.Visibility = RbSystem.IsChecked == true ? Visibility.Visible : Visibility.Collapsed;
        }

        private void Solve_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (RbLinear.IsChecked == true)
                    SolveLinear();
                else if (RbQuadratic.IsChecked == true)
                    SolveQuadratic();
                else if (RbSystem.IsChecked == true)
                    SolveSystem();
            }
            catch (Exception ex)
            {
                ResultText.Text = $"错误: {ex.Message}";
            }
        }

        private void SolveLinear()
        {
            double a = ParseDouble(LinA.Text);
            double b = ParseDouble(LinB.Text);
            if (a == 0)
            {
                ResultText.Text = b == 0 ? "无穷多解" : "无解";
                return;
            }
            double x = -b / a;
            ResultText.Text = $"方程 {a}x + {b} = 0\n\n解: x = {FormatNum(x)}";
        }

        private void SolveQuadratic()
        {
            double a = ParseDouble(QdA.Text);
            double b = ParseDouble(QdB.Text);
            double c = ParseDouble(QdC.Text);

            if (a == 0) { SolveLinear(); return; }

            var (x1, x2) = _engine.SolveQuadratic(a, b, c);
            string eq = $"{a}x² + {b}x + {c} = 0";

            if (x1 == null)
            {
                double disc = b * b - 4 * a * c;
                double realPart = -b / (2 * a);
                double imagPart = Math.Sqrt(-disc) / (2 * a);
                ResultText.Text = $"方程 {eq}\n判别式 Δ = {FormatNum(disc)} < 0\n\n" +
                    $"复数解:\nx₁ = {FormatNum(realPart)} + {FormatNum(imagPart)}i\nx₂ = {FormatNum(realPart)} - {FormatNum(imagPart)}i";
            }
            else if (x1 == x2)
            {
                ResultText.Text = $"方程 {eq}\n判别式 Δ = 0\n\n解: x = {FormatNum(x1.Value)}";
            }
            else
            {
                ResultText.Text = $"方程 {eq}\n判别式 Δ = {FormatNum(b * b - 4 * a * c)}\n\n" +
                    $"解:\nx₁ = {FormatNum(x1.Value)}\nx₂ = {FormatNum(x2.Value)}";
            }
        }

        private void SolveSystem()
        {
            double a1 = ParseDouble(SysA1.Text), b1 = ParseDouble(SysB1.Text), c1 = ParseDouble(SysC1.Text);
            double a2 = ParseDouble(SysA2.Text), b2 = ParseDouble(SysB2.Text), c2 = ParseDouble(SysC2.Text);

            double det = a1 * b2 - a2 * b1;
            if (Math.Abs(det) < 1e-15)
            {
                ResultText.Text = "系数行列式为零，方程组无解或有无穷多解";
                return;
            }

            double x = (c1 * b2 - c2 * b1) / det;
            double y = (a1 * c2 - a2 * c1) / det;
            ResultText.Text = $"方程组:\n{a1}x + {b1}y = {c1}\n{a2}x + {b2}y = {c2}\n\n解:\nx = {FormatNum(x)}\ny = {FormatNum(y)}";
        }

        private static double ParseDouble(string s) => double.TryParse(s, NumberStyles.Any, CultureInfo.InvariantCulture, out double v) ? v : 0;

        private static string FormatNum(double v)
        {
            if (v == Math.Floor(v) && Math.Abs(v) < 1e15) return v.ToString("0", CultureInfo.InvariantCulture);
            return v.ToString("G10", CultureInfo.InvariantCulture);
        }
    }
}
