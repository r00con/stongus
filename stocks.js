const STOCKS = {
  "Ding Dong Co.": 30,
  "Apple juice": 5,
  "Mojang Airlines": 50,
  "Unfairprice": 25,
  "ScamMobilez": 70
};

const players = {
  LockedIn: { money: 100, stocks: {} },
  ragavan67: { money: 100, stocks: {} },
  Htraddis_1909: { money: 100, stocks: {} },
  r00congup: { money: 100, stocks: {} },
  haolie: { money: 100, stocks: {} }
};

function registerStockRoutes(app) {

  app.get("/stocks", (_, res) => {
    res.json(STOCKS);
  });

  app.get("/player", (req, res) => {
    const user = req.query.user;
    if (!players[user]) return res.json(null);
    res.json(players[user]);
  });

  app.post("/buy", (req, res) => {
    const { user, stock } = req.body;
    if (!players[user] || !STOCKS[stock])
      return res.json({ ok: false });

    const price = STOCKS[stock];
    if (players[user].money < price)
      return res.json({ ok: false });

    players[user].money -= price;
    players[user].stocks[stock] =
      (players[user].stocks[stock] || 0) + 1;

    res.json({ ok: true });
  });

  app.post("/sell", (req, res) => {
    const { user, stock } = req.body;
    if (!players[user] || !STOCKS[stock])
      return res.json({ ok: false });

    if (!players[user].stocks[stock])
      return res.json({ ok: false });

    players[user].stocks[stock] -= 1;
    if (players[user].stocks[stock] === 0)
      delete players[user].stocks[stock];

    players[user].money += STOCKS[stock];

    res.json({ ok: true });
  });
}

module.exports = { registerStockRoutes, players };
