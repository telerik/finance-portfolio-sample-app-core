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
                    YearHigh = price + price/3,
                    YearLow = price - price/3,
                    Volume = short.MaxValue * rand.Next(0, ushort.MaxValue),
                    MarketCap = uint.MaxValue * rand.Next(0, ushort.MaxValue)
                };

                list.Add(model);
            }

            return list;
        }

        private static string CreateSymbol(string letters, int length, Random rand)
        {
            return new string(Enumerable.Repeat(letters, length)
                .Select(s => s[rand.Next(s.Length)]).ToArray());
        }
    }
}
