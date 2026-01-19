const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const stocks = require("./stocks");

/*
  players = {
    username: {
      password: "pass",
      money: 100,
      stocks: {}
    }
  }
*/
const players = {};

function ensurePlayer(name, pass) {
  if (!players[name]) {
    players[name] = {
      password: pass,
      money: 100,
      stocks: {}
    };
    return true; // new account
  }
  return false;
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "landing.html"));
});

/* LOGIN / REGISTER */
app.post("/login", (req, res) => {
  const { user, pass } = req.body;
  if (!user || !pass) return res.json({ ok: false });

  if (!players[user]) {
    // register
    ensurePlayer(user, pass);
    return res.json({ ok: true });
  }

  // login
  if (players[user].password !== pass) {
    return res.json({ ok: false });
  }

  res.json({ ok: true });
});

app.get("/player", (req, res) => {
  const user = req.query.user;
  if (!players[user]) return res.json(null);
  res.json(players[user]);
});

app.get("/stocks", (req, res) => {
  res.json(stocks);
});

app.post("/buy", (req, res) => {
  const { user, stock } = req.body;
  if (!players[user]) return res.json({ ok: false });

  const price = stocks[stock];
  if (players[user].money < price) return res.json({ ok: false });

  players[user].money -= price;
  players[user].stocks[stock] =
    (players[user].stocks[stock] || 0) + 1;

  res.json({ ok: true });
});

app.post("/sell", (req, res) => {
  const { user, stock } = req.body;
  if (!players[user]?.stocks[stock]) return res.json({ ok: false });

  players[user].money += stocks[stock];
  players[user].stocks[stock]--;

  if (players[user].stocks[stock] === 0)
    delete players[user].stocks[stock];

  res.json({ ok: true });
});

app.get("/friends", (req, res) => {
  const me = req.query.me;
  if (!players[me]) return res.json([]);

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
