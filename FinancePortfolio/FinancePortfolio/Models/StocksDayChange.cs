using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinancePortfolio.Models
{
    public class StocksDayChange
    {
        public StocksDayChange(string name, decimal value, List<StocksDayChange> items,string symbol, decimal change)
        {
            Name = name;
            Symbol = symbol;
            Change = change;
            Value = value;
            Items = items;
        }

        public string Name { get; set; }
        public string Symbol { get; set; }

        public decimal Value { get; set; }
        public decimal Change { get; set; }
        public List<StocksDayChange> Items { get; set; }
    }
}
