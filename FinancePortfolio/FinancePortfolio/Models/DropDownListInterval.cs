using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinancePortfolio.Models
{
    public class DropDownListInterval
    {
        public string Name { get; set; }
        public Interval Interval { get; set; }
        public decimal Duration { get; set; }
    }
}
