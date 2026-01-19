const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

// 👇 IMPORT STOCK LOGIC
const { registerStockRoutes, players } = require("./stocks");

// REGISTER STOCK ROUTES
registerStockRoutes(app);

/* =========================
   PAGES
   ========================= */
app.get("/", (_, res) => res.sendFile(__dirname + "/landing.html"));
app.get("/gamepage.html", (_, res) => res.sendFile(__dirname + "/gamepage.html"));
app.get("/friends.html", (_, res) => res.sendFile(__dirname + "/friends.html"));

/* =========================
   FRIENDS DATA (FIXED)
   ========================= */
app.get("/friends-data", (req, res) => {
  const me = req.query.me;
  if (!players[me]) return res.json([]);

  const friends = Object.keys(players)
    .filter(p => p !== me)
    .map(p => ({
      name: p,
      money: players[p].money,
      stocks: players[p].stocks
    }));

  res.json(friends);
});

/* =========================
   START SERVER
   ========================= */
app.listen(PORT, () => {
  console.log("Stongus server running on", PORT);
});
