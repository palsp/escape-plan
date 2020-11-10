const path = require("path");
const express = require("express");
const app = express();

const server = app.listen(process.env.PORT || 5000);

const io = require("./socket").init(server);
const roomController = require("./controller/room");
const gameController = require("./controller/game");
// const adminController = require("./controller/admin");
const GameServer = require("./models/server");
const { gameReset } = require("./util/game");
const bodyParser = require("body-parser");

let timer = 10;
let admins = [{ username: "pal", password: "12345" }];
let onlineUsers = 0;

app.use(bodyParser.urlencoded());

app.set("view engine", "ejs");
app.set("views", "views");

// app.get("/", adminController.getRoom);

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/admin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const adminIndex = admins.findIndex(
    (admin) => admin.username === username && admin.password === password
  );
  if (adminIndex >= 0) {
    const state = GameServer.getAllState();

    const rooms = Object.keys(state).map((code) => {
      return {
        code: code,
        prisoner: state[code]["prisoner"].id,
        warder: state[code]["warder"].id,
      };
    });

    res.render("admin", {
      rooms: rooms,
    });
  } else {
    res.redirect("/");
  }
});

app.post("/reset/:code", (req, res) => {
  const gameCode = req.params.code;
  console.log("gameCode", gameCode);
  GameServer.setState(gameCode, {});

  //return to home page
  io.in(gameCode).emit("reset");
  res.redirect("/");
});

io.on("connection", (socket) => {
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

  // socket.on("play", gameController.play.bind(this, socket));
  socket.on("play", (data) => {
    const winner = gameController.play(socket, data);
    const gameCode = GameServer.getGameRoom(socket.id);
    let gameState = GameServer.getState(gameCode);
    if (!winner) {
      // continue game
      console.log("continue game in game loop");
      gameState.turn = !gameState.turn;
      // resetTimer();
      timer = 10;
      return io.in(gameCode).emit("gameContinue", JSON.stringify(gameState));
    } else if (winner === 1) {
      //  prisoner win this round
      gameState["prisoner"].win += 1;
      if (gameState["prisoner"].win === 3) {
        gameState = {};
        return io.in(gameCode).emit(
          "gameWinner",
          JSON.stringify({
            myRole: "prisoner",
            winMsg: "Congratulation!!!",
            loseMsg: "You lose!!!!!",
          })
        );
      }
      gameState = gameReset(gameState, "prisoner");
      // resetTimer();
      timer = 10;
      return io.in(gameCode).emit("prisonerWin", JSON.stringify(gameState));
    } else if (winner === 2) {
      // warder win this round
      gameState["warder"].win += 1;
      if (gameState["warder"].win === 3) {
        gameState = {};
        // clear game Room
        return io.in(gameCode).emit(
          "gameWinner",
          JSON.stringify({
            myRole: "warder",
            winMsg: "Congratulation!!!",
            loseMsg: "You lose!!!!!",
          })
        );
      }
      gameState = gameReset(gameState, "warder");
      timer = 10;
      return io.in(gameCode).emit("warderWin", JSON.stringify(gameState));
    }
  });

  socket.on("ready", () => {
    const gameCode = GameServer.getGameRoom(socket.id);
    const gameState = GameServer.getState(gameCode);
    io.in(gameCode).emit("gameStart", JSON.stringify(gameState));
    console.log("user emit ready");

    const intervalId = setInterval(() => {
      timer -= 1;
      io.in(gameCode).emit("updateTimer", timer);
      if (timer === 0) {
        timer = 10;
        gameState.turn = !gameState.turn;
        io.in(gameCode).emit("switchTurn", gameState.turn);
      }
    }, 1000);
  });

  socket.on("chat message", (recipientUserName, messageContent) => {
    //get all clients (socketIds) of recipient
    let recipientSocketIds = userSocketIdMap.get(recipientUserName);
    for (let socketId of recipientSocketIds) {
      io.to(socketID).emit("new message", messageContent);
    }
  });
});
