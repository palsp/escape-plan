const express = require("express");

const app = express();

const server = app.listen(process.env.PORT || 5000);

const io = require("./socket").init(server);
const roomController = require("./controller/room");
const gameController = require("./controller/game");

io.on("connection", (socket) => {
  socket.emit("init", "Hello User");
  console.log("User is connected");

  socket.on("createNewGame", roomController.createGame.bind(this, socket));
  socket.on("joinRoom", roomController.joinGame.bind(this, socket));

  socket.on("validateMove", gameController.validateMove.bind(this, socket));
  // socket.on("assignBlock", gameController.assignBlock.bind(this, socket));
  // socket.on("gameStart" , )
});
