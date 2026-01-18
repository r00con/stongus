const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (html, images, css, js)
app.use(express.static(__dirname));

// ROOT → landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "landing.html"));
});

// Optional pages (for later navigation)
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname, "gamepage.html"));
});

app.get("/friends", (req, res) => {
  res.sendFile(path.join(__dirname, "friends.html"));
});

// Start server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
