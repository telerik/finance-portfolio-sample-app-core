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

        public StockGridService(IHubContext<StockHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(UpdateStocks, null, TimeSpan.Zero,
            TimeSpan.FromSeconds(5));

            return Task.CompletedTask;
        }

        private void UpdateStocks(object state)
        {
            var list = new StockDataGenerator().GetRandomStocks(20, "USD");

            _hubContext.Clients.All.SendAsync("Read", list);
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

    }
}
