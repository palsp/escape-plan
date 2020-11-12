const path = require("path");
const express = require("express");
const app = express();

const server = app.listen(process.env.PORT || 5000);

const io = require("./socket").init(server);
const roomController = require("./controller/room");
const gameController = require("./controller/game");
// const adminController = require("./controller/admin");
const GameServer = require("./models/server");
const { gameReset, destroyblock } = require("./util/game");
const bodyParser = require("body-parser");

let timer = 10;
let admins = [{ username: "pal", password: "12345" }];
let onlineUsers = 0;
let intervalId;

const clients = {};

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

app.get("/reset/:code", (req, res) => {
  const gameCode = req.params.code;
  GameServer.setState(gameCode, {});

  //return to home page
  io.in(gameCode).emit("reset");
  res.redirect("/");
});

io.on("connection", (socket) => {
  // tell other clients that you joined
  socket.on("greeting", (username) => {
    console.log("greeting");
    clients[socket.id] = username;
    socket.broadcast.emit("userJoin", { name: username });
  });

  socket.on("requestUserList", () => {
    const rooms = GameServer.getAllRoom();
    let clientList = Object.keys(clients).filter((id) => {
      return id !== socket.id && !rooms[id];
    });

    // console.log("socket", socket.id, clients[socket.id]);

    clientList = clientList.map((id) => {
      return { name: clients[id] };
    });

    // console.log("list", clientList);
    // console.log("with name", clientList);
    socket.emit("userList", JSON.stringify({ clientList: clientList }));
  });

  // invited other users
  socket.on("inviteUser", ({ name, gameCode }) => {
    // const clients = GameServer.getAllClients();
    // console.log("inviteUser", gameCode);
    const userIndex = Object.keys(clients).findIndex((id) => {
      return clients[id] === name;
    });

    // const fromUser = Object.keys(clients)[socket.id];
    const fromUser = clients[socket.id];
    const id = Object.keys(clients)[userIndex];
    socket.to(id).emit("invite", { fromUser: fromUser, gameCode: gameCode });
  });

  socket.on("acceptInvite", (gameCode) => {
    console.log("accept invite");
    roomController.joinGame(socket, gameCode);
  });
  socket.on("getAllRoom", () => {});
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

  // socket.on("createNewGame", roomController.createGame.bind(this, socket));

  socket.on("selectedChar", (char) => {
    const gameCode = GameServer.getGameRoom(socket.id);
    const gameState = GameServer.getState(gameCode);
    console.log("selected", gameState);
    gameState.selectedChar = char;
    console.log("assign", gameState);
  });

  socket.on("createNewGame", () => {
    roomController.createGame(socket);

    socket.broadcast.emit("updateClientList", { name: clients[socket.id] });
  });
  socket.on("joinRoom", roomController.joinGame.bind(this, socket));
  socket.on("requestAllRoom", roomController.getAllRoom.bind(this, socket));

  socket.on("destroyblock", (data) => {
    console.log("in destroy");
    const transformedState = JSON.parse(data);
    const role = transformedState.myRole;
    const move = transformedState.keyPress;
    const gameCode = transformedState.gameCode;
    let gameState = GameServer.getState(gameCode);
    const turn = gameState.turn;
    if ((turn && role !== "warder") || (!turn && role !== "prisoner")) {
      return;
    }
    const updatedState = destroyblock(gameCode, socket.id, move);

    if (updatedState) {
      gameState = updatedState;
    }
    gameState.turn = !gameState.turn;
    timer = 10;
    return io.in(gameCode).emit("destroyBlock", JSON.stringify(gameState));
  });

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

    intervalId = setInterval(() => {
      timer -= 1;
      io.in(gameCode).emit("updateTimer", timer);
      if (timer === 0) {
        timer = 10;
        gameState.turn = !gameState.turn;
        io.in(gameCode).emit("switchTurn", gameState.turn);
      }
    }, 1000);
  });

  socket.on("endgame", () => {
    clearInterval(intervalId);
    timer = 10;
  });

  socket.on("chat message", (recipientUserName, messageContent) => {
    //get all clients (socketIds) of recipient
    let recipientSocketIds = userSocketIdMap.get(recipientUserName);
    for (let socketId of recipientSocketIds) {
      io.to(socketID).emit("new message", messageContent);
    }
  });
});
