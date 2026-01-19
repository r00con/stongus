const express = require("express");
const app = express();
const path = require("path");

/* =====================
   MIDDLEWARE
===================== */
app.use(express.json());
app.use(express.static("public"));

/* =====================
   STOCK ROUTES (PART 1)
===================== */
const { registerStockRoutes } = require("./stocks");
registerStockRoutes(app);

/* =====================
   PLAYER DATA
===================== */
const players = {};

/* =====================
   ENSURE PLAYER EXISTS
===================== */
function ensurePlayer(user) {
  if (!players[user]) {
    players[user] = {
      money: 100,
      stocks: {}
    };
  }
}

/* =====================
   GET PLAYER
===================== */
app.get("/player", (req, res) => {
  const user = req.query.user;
  if (!user) return res.json(null);

  ensurePlayer(user);
  res.json(players[user]);
});

/* =====================
   BUY STOCK
===================== */
app.post("/buy", (req, res) => {
  const { user, stock } = req.body;
  if (!user || !stock) return res.json({ ok: false });

  ensurePlayer(user);

  // get current price
  const prices = require("./stocks").getPrices?.();
  const price = prices ? prices[stock] : null;
  if (!price) return res.json({ ok: false });

  if (players[user].money < price) {
    return res.json({ ok: false });
  }

  players[user].money -= price;
  players[user].stocks[stock] =
    (players[user].stocks[stock] || 0) + 1;

  res.json({ ok: true });
});

/* =====================
   SELL STOCK
===================== */
app.post("/sell", (req, res) => {
  const { user, stock } = req.body;
  if (!user || !stock) return res.json({ ok: false });

  ensurePlayer(user);

  if (!players[user].stocks[stock]) {
    return res.json({ ok: false });
  }

  const prices = require("./stocks").getPrices?.();
  const price = prices ? prices[stock] : null;
  if (!price) return res.json({ ok: false });

  players[user].money += price;
  players[user].stocks[stock]--;

  if (players[user].stocks[stock] <= 0) {
    delete players[user].stocks[stock];
  }

  res.json({ ok: true });
});

/* =====================
   FRIENDS DATA
===================== */
app.get("/friends-data", (req, res) => {
  const me = req.query.me;
  if (!me) return res.json([]);

  ensurePlayer(me);

  const list = Object.keys(players)
    .filter(p => p !== me)
    .map(p => ({
      name: p,
      money: players[p].money,
      stocks: Object.keys(players[p].stocks)
    }));

  res.json(list);
});

/* =====================
   HEALTH CHECK
===================== */
app.get("/health", (req, res) => {
  res.send("ok");
});

/* =====================
   START SERVER
===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Stongus server running on port", PORT);
});
