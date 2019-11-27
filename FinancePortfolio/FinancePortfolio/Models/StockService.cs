using Kendo.Mvc.UI;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace FinancePortfolio.Models
{
    public class StockService
    {
        private static DbContext GetTables()
        {
            DbContext context = new DbContext();

            using (StreamReader r = new StreamReader(@"Data\data.json"))
            {
                string json = r.ReadToEnd();
                context = JsonConvert.DeserializeObject<DbContext>(json);
            }

            return context;
        }

        public IEnumerable<Stock> GetPortfolioStocks()
        {
            IEnumerable<Stock> items = GetTables().StocksInPortfolio;

            return items;
        }

        public IEnumerable<Stock> GetUncategorizedStocks()
        {
            IEnumerable<Stock> items = GetTables().UncategorizedStocks;

            return items;
        }

        public IEnumerable<TreeMapStock> GetTreeMapStocks()
        {
            IEnumerable<TreeMapStock> items = GetTables().TreeMapStocks;

            return items;
        }
    }
}
