// stocks.js
const stocks = {
  "Ding Dong Co.": { start: 30, price: 30, candles: [] },
  "Apple juice": { start: 5, price: 5, candles: [] },
  "Mojang Airlines": { start: 50, price: 50, candles: [] },
  "Unfairprice": { start: 25, price: 25, candles: [] },
  "ScamMobilez": { start: 70, price: 70, candles: [] }
};

/* =========================
   CANDLE CREATION
========================= */
function createCandle(name) {
  const stock = stocks[name];
  const open = stock.price;

  const maxMove = stock.start;
  const change =
    Math.floor(Math.random() * (maxMove * 2 + 1)) - maxMove;

  let close = open + change;
  if (close < 1) close = 1;

  const high = Math.max(open, close);
  const low = Math.min(open, close);

  stock.price = close;

  stock.candles.push({
    time: Date.now(),
    open,
    high,
    low,
    close
  });

  // keep last 1440 minutes (1 day)
  if (stock.candles.length > 1440) {
    stock.candles.shift();
  }
}

/* =========================
   ENGINE — RUNS ALWAYS
========================= */
setInterval(() => {
  Object.keys(stocks).forEach(createCandle);
  console.log("Prices updated");
}, 60 * 1000); // 1 minute

/* =========================
   ROUTES
========================= */
function registerStockRoutes(app) {

  // current prices
  app.get("/stocks", (req, res) => {
    const prices = {};
    Object.keys(stocks).forEach(s => {
      prices[s] = stocks[s].price;
    });
    res.json(prices);
  });

  // candles for ONE stock
  app.get("/candles", (req, res) => {
    const { stock } = req.query;
    if (!stocks[stock]) return res.json([]);
    res.json(stocks[stock].candles);
  });
}

module.exports = { registerStockRoutes };
