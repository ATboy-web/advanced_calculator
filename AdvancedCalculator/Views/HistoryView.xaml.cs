using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Controls;
using AdvancedCalculator.Models;

namespace AdvancedCalculator.Views
{
    public partial class HistoryView : UserControl
    {
        private readonly ObservableCollection<CalculationHistory> _history = new();

        public HistoryView()
        {
            InitializeComponent();
            HistoryList.ItemsSource = _history;

            BasicCalculatorView.OnCalculation += AddHistory;
            ScientificCalculatorView.OnCalculation += AddHistory;
        }

        private void AddHistory(CalculationHistory entry)
        {
            _history.Insert(0, entry);
            if (_history.Count > 100) _history.RemoveAt(_history.Count - 1);
        }

        private void History_Selected(object sender, SelectionChangedEventArgs e)
        {
            if (HistoryList.SelectedItem is CalculationHistory item)
            {
                Clipboard.SetText(item.Result);
                MessageBox.Show($"已复制结果: {item.Result}", "提示", MessageBoxButton.OK, MessageBoxImage.Information);
            }
        }

        private void ClearHistory_Click(object sender, RoutedEventArgs e)
        {
            if (MessageBox.Show("确定要清空所有历史记录吗？", "确认", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
            {
                _history.Clear();
            }
        }
    }
}
