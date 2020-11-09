const express = require("express");

const app = express();

const server = app.listen(process.env.PORT || 5000);

const io = require("./socket").init(server);
const roomController = require("./controller/room");
const gameController = require("./controller/game2");
const GameServer = require("./models/server");

let onlineUsers = 0;

io.on("connection", socket => {
  socket.emit("init", "Hello User");
  console.log("User is connected", onlineUsers);
  onlineUsers++;
  io.emit("onlineUsers", onlineUsers);

  socket.on("disconnect", () => {
    onlineUsers--;
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("chatMessage", ({ name, message }) => {
    io.emit("chatMessage", { name, message });
  });

  socket.on("createNewGame", roomController.createGame.bind(this, socket));
  socket.on("joinRoom", roomController.joinGame.bind(this, socket));

  socket.on("play", gameController.play.bind(this, socket));

  // socket.on("play", gameController.validateMove.bind(this, socket));
  // socket.on("ready", () => {
  //   const state = GameServer.getState(gameCode);
  //   return io.in(gameCode).emit("gameStart", JSON.stringify(state));
  // });
  // socket.on("ready", gameController.gameStart.bind(this, socket));
  // socket.on("assignBlock", gameController.assignBlock.bind(this, socket));
  // socket.on("gameStart" , )s

  socket.on("chat message", (recipientUserName, messageContent) => {
    //get all clients (socketIds) of recipient
    let recipientSocketIds = userSocketIdMap.get(recipientUserName);
    for (let socketId of recipientSocketIds) {
      io.to(socketID).emit("new message", messageContent);
    }
  });
});
