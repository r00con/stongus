const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static(__dirname));

/* =====================
   STOCKS
===================== */
const { getPrices } = require("./stocks");

/* =====================
   PLAYERS
===================== */
const players = {};

function ensurePlayer(user) {
  if (!players[user]) {
    players[user] = { money: 100, stocks: {} };
  }
}

/* =====================
   ROUTES
===================== */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "landing.html"));
});

app.get("/player", (req, res) => {
  const user = req.query.user;
  if (!user) return res.json(null);
  ensurePlayer(user);
  res.json(players[user]);
});

app.get("/stocks", (req, res) => {
  res.json(getPrices());
});

app.post("/buy", (req, res) => {
  const { user, stock } = req.body;
  if (!user || !stock) return res.json({ ok: false });

  ensurePlayer(user);
  const price = getPrices()[stock];
  if (players[user].money < price) return res.json({ ok: false });

  players[user].money -= price;
  players[user].stocks[stock] = (players[user].stocks[stock] || 0) + 1;
  res.json({ ok: true });
});

app.post("/sell", (req, res) => {
  const { user, stock } = req.body;
  if (!user || !stock) return res.json({ ok: false });

  ensurePlayer(user);
  if (!players[user].stocks[stock]) return res.json({ ok: false });

  const price = getPrices()[stock];
  players[user].money += price;
  players[user].stocks[stock]--;
  if (players[user].stocks[stock] <= 0) delete players[user].stocks[stock];

  res.json({ ok: true });
});

app.get("/friends-data", (req, res) => {
  const me = req.query.me;
  ensurePlayer(me);

  res.json(
    Object.keys(players)
      .filter(p => p !== me)
      .map(p => ({
        name: p,
        money: players[p].money,
        stocks: Object.keys(players[p].stocks)
      }))
  );
});

app.listen(process.env.PORT || 3000);
