﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using FinancePortfolio.Models;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;

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

        public IActionResult GetChartIntervalDetails(string symbol, DateTime start, DateTime end, int interval)
        {
            var data = generator.GetStockIntervalDetails(symbol, start, end, interval);
            return new JsonResult(data);
        }

        public IActionResult ReadDropDownListIntervals()
        {
            var list = generator.GetDropDownListIntervals();
            return new JsonResult(list);
        }
        public IActionResult GetTimeFilters()
        {
            var list = generator.GetTimeFilters();
            return new JsonResult(list);
        }

        public IActionResult GetTopPaneContent()
        {
            
            return PartialView("TopPane");
        }

        public IActionResult GetChartData()
        {
            var list = service.GetUncategorizedStocks();
            return new JsonResult(list);
        }

        public IActionResult GetGridData()
        {
            var list = service.GetTreeMapStocks();
            return new JsonResult(list);
        }

        public ActionResult GetHeatMapData()
        {
            var list = service.GetTreeMapStocks();

            var result = new List<StocksDayChange>();
            StocksDayChange all = new StocksDayChange("Stock Prices", 1, new List<StocksDayChange>(), null, 0, 0);
            result.Add(all);

            StocksDayChange positive = new StocksDayChange("Stock Prices", 2, new List<StocksDayChange>(),null, 0, 0);
            StocksDayChange negative = new StocksDayChange("Stock Prices", 1, new List<StocksDayChange>(),null, 0, 0);

            all.Items.Add(positive);
            all.Items.Add(negative);

            foreach (TreeMapStock symbol in list)
            {
                if (symbol.DayChange > 0) {
                    positive.Items.Add(new StocksDayChange(symbol.Name, symbol.DayChange, null, symbol.Symbol, symbol.ChangePct, symbol.Price));
                }
                else
                {
                    negative.Items.Add(new StocksDayChange(symbol.Name, symbol.DayChange, null, symbol.Symbol, symbol.ChangePct, symbol.Price));
                }

            }

            return Json(result);
        }

        public JsonResult GetProfileData([DataSourceRequest] DataSourceRequest request)
        {
            var list = new List<Stock>();
            list.Add(new Stock() { Symbol = "AAN", Name = "Aaron's, Inc.", Price = 76.61M });
            list.Add(new Stock() { Symbol = "AAPL", Name = "Apple Inc.", Price = 246.58M });
            list.Add(new Stock() { Symbol = "ACN", Name = "Accenture plc", Price = 183.07M });
            list.Add(new Stock() { Symbol = "ADBE", Name = "Adobe Inc.", Price = 270.98M });
            list.Add(new Stock() { Symbol = "AGM", Name = "Federal Agricultural Mortgage Corporation", Price = 84.57M });
            list.Add(new Stock() { Symbol = "AMZN", Name = "Amazon.com, Inc.", Price = 1779.99M });
            list.Add(new Stock() { Symbol = "ASML", Name = "ASML Holding N.V.	", Price = 263.99M });
            list.Add(new Stock() { Symbol = "AVGO", Name = "Broadcom Inc.", Price = 289.82M }); 
            list.Add(new Stock() { Symbol = "BNPQY", Name = "BNP Paribas SA", Price = 26.43M });
            list.Add(new Stock() { Symbol = "CACC", Name = "Credit Acceptance Corporation", Price = 439.20M });
            return Json(list.ToDataSourceResult(request));
        }

        public JsonResult GetProfileDataChart([DataSourceRequest] DataSourceRequest request)
        {
            var list = new Stock[] {
            new Stock() { Symbol = "AAN", Name = "Aaron's, Inc.", Price = 76.61M },
            new Stock() { Symbol = "AAPL", Name = "Apple Inc.", Price = 246.58M },
            new Stock() { Symbol = "ACN", Name = "Accenture plc", Price = 183.07M },
            new Stock() { Symbol = "ADBE", Name = "Adobe Inc.", Price = 270.98M },
            new Stock() { Symbol = "AGM", Name = "Federal Agricultural Mortgage Corporation", Price = 84.57M },
            new Stock() { Symbol = "AMZN", Name = "Amazon.com, Inc.", Price = 1779.99M },
            new Stock() { Symbol = "ASML", Name = "ASML Holding N.V.	", Price = 263.99M },
            new Stock() { Symbol = "AVGO", Name = "Broadcom Inc.", Price = 289.82M },
            new Stock() { Symbol = "BNPQY", Name = "BNP Paribas SA", Price = 26.43M },
            new Stock() { Symbol = "CACC", Name = "Credit Acceptance Corporation", Price = 439.20M }
            };

            return Json(list);
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
        public IActionResult Profile()
        {
            return View("Profile");
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
