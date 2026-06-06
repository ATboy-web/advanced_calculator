using System.Windows;
using System.Windows.Controls;
using AdvancedCalculator.Views;

namespace AdvancedCalculator
{
    public partial class MainWindow : Window
    {
        private UIElement[] _views;

        public MainWindow()
        {
            InitializeComponent();
            _views = new UIElement[] { BasicView, ScientificView, GraphView, EquationView, ConverterView, HistoryView };
            // Basic is visible by default
        }

        private void Nav_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn && btn.Tag is string tag)
            {
                foreach (var v in _views)
                    v.Visibility = Visibility.Collapsed;

                switch (tag)
                {
                    case "Basic": BasicView.Visibility = Visibility.Visible; break;
                    case "Scientific": ScientificView.Visibility = Visibility.Visible; break;
                    case "Graph": GraphView.Visibility = Visibility.Visible; break;
                    case "Equation": EquationView.Visibility = Visibility.Visible; break;
                    case "Converter": ConverterView.Visibility = Visibility.Visible; break;
                    case "History": HistoryView.Visibility = Visibility.Visible; break;
                }
            }
        }
    }
}
