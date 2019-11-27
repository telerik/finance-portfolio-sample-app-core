using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinancePortfolio.Models
{
    public class DbContext
    {
        public IEnumerable<Stock> StocksInPortfolio { get; set; }
        public IEnumerable<Stock> UncategorizedStocks { get; set; }
        public IEnumerable<TreeMapStock> TreeMapStocks{ get; set; }
    }
}
