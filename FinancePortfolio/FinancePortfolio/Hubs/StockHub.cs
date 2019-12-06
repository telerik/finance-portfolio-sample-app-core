using FinancePortfolio.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinancePortfolio.Hubs
{

    public class StockHub : Hub
    {
        private List<GridStock> stocks;
        private readonly StockDataGenerator generator;

        public StockHub()
        {
            this.stocks = new List<GridStock>();
            this.generator = new StockDataGenerator();
        }

        public IEnumerable<GridStock> Read()
        {
            this.stocks.AddRange(generator.GetRandomStocks(20, "USD"));

            return stocks;
        }
    }
}
