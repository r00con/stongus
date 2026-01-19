const express = require("express");
const app = express();
const path = require("path");

/* =====================
   MIDDLEWARE
===================== */
app.use(express.json());

/* =====================
   HOME PAGE (FIXED)
===================== */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "landing.html"));
});

/* =====================
   STATIC FILES (HTML)
===================== */
app.get("/:page", (req, res, next) => {
  const file = path.join(__dirname, req.params.page);
  if (!file.endsWith(".html")) return next();
  res.sendFile(file);
});

/* =====================
   STOCK ROUTES
===================== */
const { registerStockRoutes, getPrices } = require("./stocks");
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
   BUY
===================== */
app.post("/buy", (req, res) => {
  const { user, stock } = req.body;
  if (!user || !stock) return res.json({ ok: false });

  ensurePlayer(user);

  const prices = getPrices();
  const price = prices[stock];
  if (!price || players[user].money < price) {
    return res.json({ ok: false });
  }

  players[user].money -= price;
  players[user].stocks[stock] =
    (players[user].stocks[stock] || 0) + 1;

  res.json({ ok: true });
});

/* =====================
   SELL
===================== */
app.post("/sell", (req, res) => {
  const { user, stock } = req.body;
  if (!user || !stock) return res.json({ ok: false });

  ensurePlayer(user);

  if (!players[user].stocks[stock]) {
    return res.json({ ok: false });
  }

  const prices = getPrices();
  const price = prices[stock];
  if (!price) return res.json({ ok: false });

  players[user].money += price;
  players[user].stocks[stock]--;

  if (players[user].stocks[stock] <= 0) {
    delete players[user].stocks[stock];
  }

  res.json({ ok: true });
});

/* =====================
   FRIENDS
===================== */
app.get("/friends-data", (req, res) => {
  const me = req.query.me;
  if (!me) return res.json([]);

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

/* =====================
   HEALTH
===================== */
app.get("/health", (req, res) => {
  res.send("ok");
});

/* =====================
   START
===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Stongus server running on port", PORT);
});
