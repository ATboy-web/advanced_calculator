using System;

namespace AdvancedCalculator.Models
{
    public class CalculationHistory
    {
        public string Expression { get; set; } = "";
        public string Result { get; set; } = "";
        public DateTime Timestamp { get; set; } = DateTime.Now;

        public override string ToString() => $"{Expression} = {Result}";
    }
}
