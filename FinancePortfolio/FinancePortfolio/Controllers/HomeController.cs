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
        private readonly StockDataGenerator generator;
        public HomeController(ILogger<HomeController> logger)
        {
            this.service = new StockService();
            this.generator = new StockDataGenerator();
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult MyFunc(string symbol, DateTime start, DateTime end, int interval)
        {
            return new JsonResult(generator.GetStockIntervalDetails(symbol, start, end, interval));
        }

        public IActionResult GetTopPaneContent()
        {
            
            return PartialView("TopPane");
        }

        public IActionResult GetChartData()
        {
            var list = service.GetPortfolioStocks();
            return new JsonResult(list);
        }

        public IActionResult GetGridData()
        {
            var list = service.GetTreeMapStocks();
            return new JsonResult(list);
        }

        public JsonResult GetHeatMapData()
        {
            var list = service.GetTreeMapStocks();

            return Json(new[] { new { Items = list } });
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
