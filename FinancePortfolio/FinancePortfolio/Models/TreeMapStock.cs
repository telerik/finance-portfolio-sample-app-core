using FinancePortfolio.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinancePortfolio.Models
{
    public class TreeMapStock : IStock
    {
        public string Symbol { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal DayChange { get; set; }
        public decimal ChangePct { get; set; }
        public decimal Volume { get; set; }
        public decimal VolumeAvg { get; set; }
        public decimal MarketCap { get; set; }
        public decimal? Pe { get; set; }
        public string Currency { get; set; } // TODO: Consider introducing an Enum
        public decimal PriceOpen { get; set; }
        public decimal DayHigh { get; set; }
        public decimal DayLow { get; set; }
        public decimal HigestFor52Weeks { get; set; }
        public decimal LowestFor52Weeks { get; set; }
        public decimal CloseYesterday { get; set; }
        public decimal Shares { get; set; } // TODO: Consider using uint or ulong
        public string StockExchangeLong { get; set; }
        public string StockExchangeShort { get; set; }
        public string Timezone { get; set; }
        public string TimezoneName { get; set; }
        public decimal GmtOffset { get; set; }
        public DateTime LastTradeTime { get; set; }
        public decimal Eps { get; set; } // earnings per share
    }
}
