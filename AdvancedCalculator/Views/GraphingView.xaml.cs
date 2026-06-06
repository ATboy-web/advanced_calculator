using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;
using AdvancedCalculator.Services;

namespace AdvancedCalculator.Views
{
    public partial class GraphingView : UserControl
    {
        private readonly MathEngine _engine = new();

        public GraphingView()
        {
            InitializeComponent();
            SizeChanged += (_, _) => PlotFunction();
            Loaded += (_, _) => PlotFunction();
        }

        private void Plot_Click(object sender, RoutedEventArgs e) => PlotFunction();

        private void PlotFunction()
        {
            GraphCanvas.Children.Clear();
            if (!double.TryParse(XMinInput.Text, NumberStyles.Any, CultureInfo.InvariantCulture, out double xMin)) xMin = -10;
            if (!double.TryParse(XMaxInput.Text, NumberStyles.Any, CultureInfo.InvariantCulture, out double xMax)) xMax = 10;
            if (!double.TryParse(YMinInput.Text, NumberStyles.Any, CultureInfo.InvariantCulture, out double yMin)) yMin = -5;
            if (!double.TryParse(YMaxInput.Text, NumberStyles.Any, CultureInfo.InvariantCulture, out double yMax)) yMax = 5;

            double w = GraphCanvas.ActualWidth;
            double h = GraphCanvas.ActualHeight;
            if (w < 1 || h < 1) return;

            DrawGrid(w, h, xMin, xMax, yMin, yMax);
            DrawAxes(w, h, xMin, xMax, yMin, yMax);
            DrawFunction(w, h, xMin, xMax, yMin, yMax);
        }

        private void DrawGrid(double w, double h, double xMin, double xMax, double yMin, double yMax)
        {
            var gridBrush = new SolidColorBrush(Color.FromArgb(30, 255, 255, 255));
            double xStep = GetGridStep(xMax - xMin);
            double yStep = GetGridStep(yMax - yMin);

            for (double x = Math.Ceiling(xMin / xStep) * xStep; x <= xMax; x += xStep)
            {
                double sx = ToScreenX(x, w, xMin, xMax);
                var line = new Line { X1 = sx, Y1 = 0, X2 = sx, Y2 = h, Stroke = gridBrush, StrokeThickness = 0.5 };
                GraphCanvas.Children.Add(line);
            }
            for (double y = Math.Ceiling(yMin / yStep) * yStep; y <= yMax; y += yStep)
            {
                double sy = ToScreenY(y, h, yMin, yMax);
                var line = new Line { X1 = 0, Y1 = sy, X2 = w, Y2 = sy, Stroke = gridBrush, StrokeThickness = 0.5 };
                GraphCanvas.Children.Add(line);
            }
        }

        private void DrawAxes(double w, double h, double xMin, double xMax, double yMin, double yMax)
        {
            var axisBrush = new SolidColorBrush(Color.FromArgb(100, 255, 255, 255));
            double x0 = ToScreenX(0, w, xMin, xMax);
            double y0 = ToScreenY(0, h, yMin, yMax);

            if (x0 >= 0 && x0 <= w)
            {
                var line = new Line { X1 = x0, Y1 = 0, X2 = x0, Y2 = h, Stroke = axisBrush, StrokeThickness = 1.5 };
                GraphCanvas.Children.Add(line);
            }
            if (y0 >= 0 && y0 <= h)
            {
                var line = new Line { X1 = 0, Y1 = y0, X2 = w, Y2 = y0, Stroke = axisBrush, StrokeThickness = 1.5 };
                GraphCanvas.Children.Add(line);
            }
        }

        private void DrawFunction(double w, double h, double xMin, double xMax, double yMin, double yMax)
        {
            string expr = FuncInput.Text.Trim();
            if (string.IsNullOrEmpty(expr)) return;

            var func = _engine.CreateFunction(expr);
            var colors = new[] { "#4FC3F7", "#81C784", "#FFB74D", "#EF5350", "#CE93D8" };
            var brush = new SolidColorBrush((Color)ColorConverter.ConvertFromString(colors[0]));

            var polyline = new Polyline { Stroke = brush, StrokeThickness = 2.5 };
            int steps = (int)(w * 2);

            for (int i = 0; i <= steps; i++)
            {
                double x = xMin + (xMax - xMin) * i / steps;
                double y = func(x);
                if (double.IsNaN(y) || double.IsInfinity(y) || y < yMin || y > yMax)
                {
                    if (polyline.Points.Count > 0)
                    {
                        GraphCanvas.Children.Add(polyline);
                        polyline = new Polyline { Stroke = brush, StrokeThickness = 2.5 };
                    }
                    continue;
                }
                double sx = ToScreenX(x, w, xMin, xMax);
                double sy = ToScreenY(y, h, yMin, yMax);
                polyline.Points.Add(new Point(sx, sy));
            }
            if (polyline.Points.Count > 0) GraphCanvas.Children.Add(polyline);
        }

        private static double ToScreenX(double x, double w, double xMin, double xMax) => (x - xMin) / (xMax - xMin) * w;
        private static double ToScreenY(double y, double h, double yMin, double yMax) => h - (y - yMin) / (yMax - yMin) * h;

        private static double GetGridStep(double range)
        {
            double rough = range / 8;
            double pow = Math.Pow(10, Math.Floor(Math.Log10(rough)));
            if (rough / pow >= 5) return pow * 5;
            if (rough / pow >= 2) return pow * 2;
            return pow;
        }
    }
}
