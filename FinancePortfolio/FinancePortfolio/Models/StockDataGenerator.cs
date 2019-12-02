using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinancePortfolio.Models
{
    public class StockDataGenerator
    {
        private readonly string letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        private readonly int length = 4;
        private readonly Random rand;
        private readonly uint MS_PER_DAY = 86400000;
        private readonly uint MS_PER_MINUTE = 60000;

        public StockDataGenerator()
        {
            this.rand = new Random();
        }

        public IEnumerable<GridStock> GetRandomStocks(int count, bool initial)
        {
            ICollection<GridStock> list = new List<GridStock>();

            for (int i = 0; i < count; i++)
            {
                string symbol = CreateSymbol(letters, length, rand);
                decimal price = rand.Next(15, 47);
                GridStock model = new GridStock()
                {
                    Id = i,
                    Symbol = symbol,
                    Name = symbol + " Inc.",
                    // currency
                    Price = price,
                    DayChange = 0,
                    StockExchangeLong = "New York Stock Exchange",
                    StockExchangeShort = "NYSE",
                    Timezone = "EDT",
                    TimezoneName = "America/New_York",
                    YearHigh = price + price / 3,
                    YearLow = price - price / 3,
                    Volume = short.MaxValue * rand.Next(0, ushort.MaxValue),
                    MarketCap = uint.MaxValue * rand.Next(0, ushort.MaxValue)
                };

                list.Add(model);
            }

            return list;
        }

        public IEnumerable<DropDownListInterval> GetDropDownListIntervals()
        {
            var intervals = new List<DropDownListInterval>()
            {
                new DropDownListInterval(){Name="5M", Interval = new Interval(){Unit = "minutes", Step = 5 }, Duration = MS_PER_DAY / 24 / 12},
                new DropDownListInterval(){Name="15M", Interval = new Interval(){Unit = "minutes", Step = 15 }, Duration = MS_PER_DAY / 24 / 4},
                new DropDownListInterval(){Name="30M", Interval = new Interval(){Unit = "minutes", Step = 30 }, Duration = MS_PER_DAY / 24 / 2},
                new DropDownListInterval(){Name="1H", Interval = new Interval(){Unit = "hours", Step = 1 }, Duration = MS_PER_DAY / 24},
                new DropDownListInterval(){Name="4H", Interval = new Interval(){Unit = "hours", Step = 4 }, Duration = MS_PER_DAY / 6},
                new DropDownListInterval(){Name="1D", Interval = new Interval(){Unit = "days", Step = 1 }, Duration = MS_PER_DAY},
                new DropDownListInterval(){Name="1W", Interval = new Interval(){Unit = "weeks", Step = 1 }, Duration = MS_PER_DAY * 7},
            };

            return intervals;
        }

        public IEnumerable<TimeFilter> GetTimeFilters()
        {
            var timeFilters = new List<TimeFilter>()
            {
                new TimeFilter(){ Name = "1H", Duration = MS_PER_DAY / 24},
                new TimeFilter(){ Name = "4H", Duration = MS_PER_DAY / 6 },
                new TimeFilter() { Name = "12H", Duration = MS_PER_DAY / 2 },
                new TimeFilter() { Name = "1D", Duration = MS_PER_DAY },
                new TimeFilter() { Name = "4D", Duration = MS_PER_DAY * 4 },
                new TimeFilter() { Name = "1W", Duration = MS_PER_DAY * 7 }
            };

            return timeFilters;
        }

        private static string CreateSymbol(string letters, int length, Random rand)
        {
            return new string(Enumerable.Repeat(letters, length)
                .Select(s => s[rand.Next(s.Length)]).ToArray());
        }
    }
}
