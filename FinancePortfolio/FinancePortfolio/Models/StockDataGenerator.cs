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
        private readonly StockService service;

        public StockDataGenerator()
        {
            this.service = new StockService();
            this.rand = new Random();
        }

        public IEnumerable<GridStock> GetRandomStocks(int count, string currency)
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
                    Currency = currency,
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
                new DropDownListInterval(){Name="5M", Interval = new Interval(){Unit = "Minutes", Step = 5 }, Duration = MS_PER_DAY / 24 / 12},
                new DropDownListInterval(){Name="15M", Interval = new Interval(){Unit = "Minutes", Step = 15 }, Duration = MS_PER_DAY / 24 / 4},
                new DropDownListInterval(){Name="30M", Interval = new Interval(){Unit = "Minutes", Step = 30 }, Duration = MS_PER_DAY / 24 / 2},
                new DropDownListInterval(){Name="1H", Interval = new Interval(){Unit = "Hours", Step = 1 }, Duration = MS_PER_DAY / 24},
                new DropDownListInterval(){Name="4H", Interval = new Interval(){Unit = "Hours", Step = 4 }, Duration = MS_PER_DAY / 6},
                new DropDownListInterval(){Name="1D", Interval = new Interval(){Unit = "Days", Step = 1 }, Duration = MS_PER_DAY},
                new DropDownListInterval(){Name="1W", Interval = new Interval(){Unit = "Weeks", Step = 1 }, Duration = MS_PER_DAY * 7},
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

        public IEnumerable<StockIntervalDetails> GetStockIntervalDetails(string symbol, DateTime rangeStart, DateTime rangeEnd, int intervalInMinutes)
        {
            List<Stock> stocks = service.GetPortfolioStocks().ToList();
            var uncategorizedStocks = service.GetUncategorizedStocks();
            List<Stock> data = stocks.Concat(uncategorizedStocks).ToList();
            
            return GenerateDataForSymbol(data.FirstOrDefault(s => s.Symbol == symbol), rangeStart, rangeEnd, intervalInMinutes);
        }

        public IEnumerable<StockIntervalDetails> GenerateDataForSymbol(Stock stock, DateTime rangeStart, DateTime rangeEnd, int intervalInMinutes)
        {
            var data = new List<StockIntervalDetails>();
            int minutesPerDay = 1440;
            var standingPoint = new StandingPoint
            {
                Close = stock.Intraday.FirstOrDefault(),
                Volume = intervalInMinutes < minutesPerDay ?
                    stock.Volume / (minutesPerDay / intervalInMinutes) :
                    stock.Volume * (intervalInMinutes / minutesPerDay)
            };

            var intervalInMs = MS_PER_MINUTE * intervalInMinutes;
            var start = GetTime(rangeStart) + intervalInMs;
            var index = 0;

            for (var dateInMs = start; dateInMs <= GetTime(rangeEnd); dateInMs += intervalInMs, index++)
            {
                var previousInterval = new StandingPoint();
                if (index > 1)
                {
                    previousInterval.Close = data[index - 1].Close;
                    previousInterval.Volume = data[index - 1].Volume;
                }
                else
                {
                    previousInterval.Close = standingPoint.Close;
                    previousInterval.Volume = standingPoint.Volume;
                }

                var random = rand.NextDouble() + 0.01;
                var volatility = 0.03;

                var cngP = 2 * volatility * random;
                if (cngP > volatility)
                {
                    cngP -= (2 * volatility);
                }

                var change = previousInterval.Close * (decimal)cngP;
                var newPrice = previousInterval.Close + change;
                var high = Math.Max(newPrice, previousInterval.Close);
                var low = Math.Min(newPrice, previousInterval.Close);
                TimeSpan time = TimeSpan.FromMilliseconds(dateInMs);
                DateTime date = new DateTime(1970, 1, 1) + time;
                
                data.Add(new StockIntervalDetails
                {
                    Open = Math.Round(previousInterval.Close, 2),
                    Close = Math.Round(newPrice, 2),
                    High = Math.Round(high + (0.015m * high), 2),
                    Low = Math.Round(low + (0.015m * low), 2),
                    Volume = GetStocksTradeVolume(previousInterval.Volume),
                    Date = date
                });
            }

            return data;
        }

        private static string CreateSymbol(string letters, int length, Random rand)
        {
            return new string(Enumerable.Repeat(letters, length)
                .Select(s => s[rand.Next(s.Length)]).ToArray());
        }

        private Int64 GetTime(DateTime date)
        {
            Int64 retval = 0;
            var st = new DateTime(1970, 1, 1);
            TimeSpan t = (date - st);
            retval = (Int64)(t.TotalMilliseconds + 0.5);
            return retval;
        }

        private decimal GetStocksTradeVolume(decimal oldValue)
        {
            var coef = Math.Round(rand.NextDouble(), 2);
            var newValue = Math.Round(oldValue + (oldValue * (decimal)coef / 1.5m), 0);
            var diff = newValue - oldValue;
            var sign = rand.NextDouble() >= 0.5 ? 1 : -1;

            return Math.Round(oldValue + (diff * sign), 0);
        }
    }
}
