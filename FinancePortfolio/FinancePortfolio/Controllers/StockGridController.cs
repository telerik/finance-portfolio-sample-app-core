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
    public class StockGridController : Controller
    {
        private readonly StockDataGenerator generator;
        public StockGridController()
        {
            this.generator = new StockDataGenerator();
        }

        public ActionResult Stocks_Read([DataSourceRequest]DataSourceRequest request)
        {
            return new JsonResult(generator.GetRandomStocks(2, true).ToDataSourceResult(request));
        }
    }
}