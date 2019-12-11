using FinancePortfolio.Hubs;
using FinancePortfolio.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FinancePortfolio.Services
{
    public class StockGridService : IHostedService
    {
        private Timer _timer;
        private readonly IHubContext<StockHub> _hubContext;
        private List<GridStock> stocks;
        private readonly StockService service;

        public StockGridService(IHubContext<StockHub> hubContext)
        {
            _hubContext = hubContext;
            this.service = new StockService();
            this.stocks = new List<GridStock>();
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            this.stocks.AddRange(service.GetStocks());
            _timer = new Timer(UpdateStocks, null, TimeSpan.Zero,
            TimeSpan.FromSeconds(2));

            return Task.CompletedTask;
        }

        private void UpdateStocks(object state)
        {
            var list = this.stocks;

            foreach (var item in list)
            {
                item.DayChange = GetChange();
                if (item.DayChange != 0)
                {
                    item.Price = item.Price + item.DayChange;
                }
            }

            _hubContext.Clients.All.SendAsync("Read", list);
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        private decimal GetChange()
        {
            var rnd = new Random().NextDouble();
            var change = rnd > 0.5 ? rnd > 0.75 ? -rnd * 2 : rnd * 2 : 0;
            return (decimal)change;
        }

    }
}
