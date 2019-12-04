using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinancePortfolio.Models;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Mvc;

namespace FinancePortfolio.Controllers
{
    public class GridController : Controller
    {
        private readonly StockService service;
        public GridController()
        {
            this.service = new StockService();
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult ReadGridData([DataSourceRequest] DataSourceRequest request)
        {
            var data = service.GetPortfolioStocks();

            return Json(data.ToDataSourceResult(request));
        }
    }
}