const express = require("express");

const app = express();

const server = app.listen(process.env.PORT || 3000);

const io = require("./socket").init(server);
const gameController = require("./controller/game");

io.on("connection", (socket) => {
  socket.emit("init", "Hello User");
  console.log("User is connected");

  socket.on("createNewGame", gameController.createGame.bind(this, socket));
  socket.on("joinRoom", gameController.joinGame.bind(this, socket));
  socket.on("assignBlock", gameController.assignBlock.bind(this, socket));
  socket.on("gameStart");
});
