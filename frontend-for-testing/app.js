const express = require("express");
const io = require("socket.io-client");
const socket = io.connect("http://localhost:3000");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const { json } = require("body-parser");

app.use(bodyParser.urlencoded());

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/create-game", (req, res, next) => {
  socket.emit("createNewGame", JSON.stringify({ message: "create new game" }));
  // socket.emit("createNewGame", { message: "create new game" });

  next();
});

app.post("/join-session", (req, res, next) => {
  const session = req.body.session;
  socket.emit("joinRoom", session);
  next();
});

// const join_game = document.getElementById("join-session");

// create_new_game.addEventListener("click", () => {
//   socket.emit("createNewGame", "create new game");
// });

// join_game.addEventListener("click", () => {
//   socket.emit("joinRoom", "jp06s0kgksim32");
// });
socket.on("init", (msg) => {
  console.log(msg);
});

socket.on("newGame", (msg) => {
  console.log(msg);
});

socket.on("joinFailed", (msg) => {
  console.log(msg);
});

socket.on("joinSuccess", (msg) => {
  const res = JSON.parse(msg);

  const role = res.role;
  console.log(res.gameState[role].pos);
});

socket.on("newGame", (msg) => {
  console.log(msg);
});

socket.on("err", (msg) => {
  console.log(JSON.parse(msg));
});
app.listen(5000);
