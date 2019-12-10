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
        private readonly StockService service;

        public StockHub()
        {
            this.stocks = new List<GridStock>();
            this.service = new StockService();
        }

        public IEnumerable<GridStock> Read()
        {
            this.stocks.AddRange(service.GetStocks());
            return this.stocks;
        }
    }
}
