using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinancePortfolio.Interfaces
{
    public interface IStock
    {
        public string Symbol { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal DayChange { get; set; }
        public decimal ChangePct { get; set; }
        public decimal Volumn { get; set; }
        public decimal VolumnAvg { get; set; }
        public decimal MarketCap { get; set; }
        public decimal? Pe { get; set; } //price-to-earnings ratio
    }
}
