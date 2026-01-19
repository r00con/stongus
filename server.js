const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "landing.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "login.html")));
app.get("/game", (req, res) => res.sendFile(path.join(__dirname, "gamepage.html")));
app.get("/friends", (req, res) => res.sendFile(path.join(__dirname, "friends.html")));

// ---- GAME STATE (temporary) ----
const players = {
  LockedIn: { money: 100, stocks: [] },
  ragavan67: { money: 100, stocks: [] },
  Htraddis_1909: { money: 100, stocks: [] },
  r00congup: { money: 100, stocks: [] },
  haolie: { money: 100, stocks: [] }
};

// ---- SOCKETS ----
io.on("connection", (socket) => {
  socket.on("join", (username) => {
    socket.username = username;
    io.emit("players:update", players);
  });

  socket.on("disconnect", () => {});
});

server.listen(PORT, () => {
  console.log("Stongus server running on port " + PORT);
});
