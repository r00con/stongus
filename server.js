const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files (html, css, js)
app.use(express.static(__dirname));

/* ======================
   GAME DATA (SERVER MEMORY)
   ====================== */
const players = {
  LockedIn: { money: 100, stocks: ["A"] },
  ragavan67: { money: 100, stocks: [] },
  Htraddis_1909: { money: 100, stocks: ["B"] },
  r00congup: { money: 100, stocks: [] },
  haolie: { money: 100, stocks: [] }
};

/* ======================
   PAGES
   ====================== */
app.get("/", (req, res) => res.sendFile(__dirname + "/landing.html"));
app.get("/login", (req, res) => res.sendFile(__dirname + "/login.html"));
app.get("/gamepage.html", (req, res) =>
  res.sendFile(__dirname + "/gamepage.html")
);
app.get("/friends.html", (req, res) =>
  res.sendFile(__dirname + "/friends.html")
);

/* ======================
   FRIENDS DATA ENDPOINT
   ====================== */
app.get("/friends-data", (req, res) => {
  const me = req.query.me;

  if (!me || !players[me]) {
    return res.json([]);
  }

  const friends = Object.keys(players)
    .filter(name => name !== me)
    .map(name => ({
      name: name,
      money: players[name].money,
      stocks: players[name].stocks
    }));

  res.json(friends);
});

/* ======================
   START SERVER
   ====================== */
app.listen(PORT, () => {
  console.log("Stongus server running on port " + PORT);
});
