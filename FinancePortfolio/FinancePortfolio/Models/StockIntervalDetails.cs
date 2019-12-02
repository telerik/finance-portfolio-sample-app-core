using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinancePortfolio.Models
{
    public class StockIntervalDetails
    {
        public decimal Open{ get; set; }
        public decimal Close{ get; set; }
        public decimal High{ get; set; }
        public decimal Low{ get; set; }
        public decimal Volume{ get; set; }
        public DateTime Date { get; set; }
    }
}
