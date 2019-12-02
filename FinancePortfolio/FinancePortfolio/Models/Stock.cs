﻿using FinancePortfolio.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinancePortfolio.Models
{
    public class Stock : IStock
    {
        public Stock()
        {
            this.Intraday = new List<decimal>();
        }

        public string Symbol { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal DayChange { get; set; }
        public decimal ChangePct { get; set; }
        public decimal Volume { get; set; }
        public decimal VolumeAvg { get; set; }
        public decimal MarketCap { get; set; }
        public decimal? Pe { get; set; }
        public IEnumerable<decimal> Intraday { get; set; }
    }
}
