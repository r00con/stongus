const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const STOCKS = require("./stocks");

/* 🔒 WHITELIST ACCOUNTS */
const ACCOUNTS = {
  "LockedIn": "H73Yyr7",
  "ragavan67": "oJD785k",
  "Htraddis_1909": "Qys24K0",
  "r00congup": "Km98N0",
  "haolie": "Hu72j9W"
};

/*
 players = {
   username: { money: 100, stocks: {} }
 }
*/
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

/* LOGIN */
app.post("/login", (req, res) => {
  const { user, pass } = req.body;
  if (ACCOUNTS[user] !== pass) return res.json({ ok: false });
  ensurePlayer(user);
  res.json({ ok: true });
});

/* PLAYER DATA */
app.get("/player", (req, res) => {
  const user = req.query.user;
  if (!players[user]) return res.json(null);
  res.json(players[user]);
});

/* STOCK LIST */
app.get("/stocks", (req, res) => {
  res.json(STOCKS);
});

/* BUY */
app.post("/buy", (req, res) => {
  const { user, stock } = req.body;
  ensurePlayer(user);

  const price = STOCKS[stock];
  if (price === undefined) return res.json({ ok: false });
  if (players[user].money < price) return res.json({ ok: false });

  players[user].money -= price;
  players[user].stocks[stock] =
    (players[user].stocks[stock] || 0) + 1;

  res.json({ ok: true });
});

/* SELL */
app.post("/sell", (req, res) => {
  const { user, stock } = req.body;
  if (!players[user]?.stocks[stock]) return res.json({ ok: false });

  players[user].money += STOCKS[stock];
  players[user].stocks[stock]--;

  if (players[user].stocks[stock] === 0)
    delete players[user].stocks[stock];

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
        stocks: Object.keys(players[p].stocks)
      }))
  );
});

app.listen(process.env.PORT || 3000);
