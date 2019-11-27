using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using FinancePortfolio.Models;

namespace FinancePortfolio.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly StockService service;
        public HomeController(ILogger<HomeController> logger)
        {
            this.service = new StockService();
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult GetTopPaneContent()
        {
            return PartialView("TopPane");
        }

        public IActionResult GetBottomPaneContent()
        {
            var data = service.GetPortfolioStocks();

            return PartialView("BottomPane", data);
        }

        public IActionResult HeatMap()
        {
            return View("HeatMap");
        }

        public IActionResult DataVirtualization()
        {
            return View("DataVirtualization");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
