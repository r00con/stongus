const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

// IMPORT STOCK LOGIC
const { registerStockRoutes, players } = require("./stocks");

// REGISTER STOCK ROUTES
registerStockRoutes(app);

/* =========================
   PAGES
   ========================= */
app.get("/", (req, res) => res.sendFile(__dirname + "/landing.html"));
app.get("/login", (req, res) => res.sendFile(__dirname + "/login.html"));
app.get("/gamepage.html", (req, res) => res.sendFile(__dirname + "/gamepage.html"));
app.get("/friends.html", (req, res) => res.sendFile(__dirname + "/friends.html"));
app.get("/stockspage.html", (req, res) => res.sendFile(__dirname + "/stockspage.html"));

/* =========================
   FRIENDS DATA (NAMES ONLY)
   ========================= */
app.get("/friends-data", (req, res) => {
  const me = req.query.me;
  if (!players[me]) return res.json([]);

  const friends = Object.keys(players)
    .filter(name => name !== me)
    .map(name => ({
      name,
      money: players[name].money,
      stocks: Object.keys(players[name].stocks)
    }));

  res.json(friends);
});

/* =========================
   START SERVER
   ========================= */
app.listen(PORT, () => {
  console.log("Stongus server running on port", PORT);
});
