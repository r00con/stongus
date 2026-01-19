const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const STOCKS = require("./stocks");

/* 🔒 ALLOWED ACCOUNTS */
const ACCOUNTS = {
  LockedIn: "H73Yyr7",
  ragavan67: "oJD785k",
  Htraddis_1909: "Qys24K0",
  r00congup: "Km98N0",
  haolie: "Hu72j9W"
};

const players = {};

function ensurePlayer(user) {
  if (!players[user]) {
    players[user] = { money: 100, stocks: {} };
  }
}

/* ROUTES */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "landing.html"));
});

app.post("/login", (req, res) => {
  const { user, pass } = req.body;
  if (ACCOUNTS[user] !== pass) return res.json({ ok: false });
  ensurePlayer(user);
  res.json({ ok: true });
});

app.get("/player", (req, res) => {
  res.json(players[req.query.user] || null);
});

/* SEND STOCKS */
app.get("/stocks", (req, res) => {
  const out = {};
  Object.keys(STOCKS).forEach(id => {
    out[id] = STOCKS[id].price;
  });
  res.json(out);
});

/* BUY */
app.post("/buy", (req, res) => {
  const { user, stockId } = req.body;
  ensurePlayer(user);

  const stock = STOCKS[stockId];
  if (!stock) return res.json({ ok: false });

  if (players[user].money < stock.price)
    return res.json({ ok: false });

  players[user].money -= stock.price;
  players[user].stocks[stockId] =
    (players[user].stocks[stockId] || 0) + 1;

  res.json({ ok: true });
});

/* SELL */
app.post("/sell", (req, res) => {
  const { user, stockId } = req.body;
  if (!players[user]?.stocks[stockId]) return res.json({ ok: false });

  players[user].money += STOCKS[stockId].price;
  players[user].stocks[stockId]--;

  if (players[user].stocks[stockId] === 0)
    delete players[user].stocks[stockId];

  res.json({ ok: true });
});

/* FRIENDS */
app.get("/friends", (req, res) => {
  const me = req.query.me;
  ensurePlayer(me);

  res.json(
    Object.keys(players)
      .filter(p => p !== me)
      .map(p => ({
        name: p,
        money: players[p].money,
        stocks: Object.keys(players[p].stocks).map(
          id => STOCKS[id].name
        )
      }))
  );
});

app.listen(process.env.PORT || 3000);
