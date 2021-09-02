const express = require("express");
const { urlencoded } = express;
const app = express();

const port = process.env.PORT || 5000
const server = app.listen(port , () => {
  console.log(`start server on port ${port}`)
});

const io = require("./socket").init(server);
const roomController = require("./controller/room");
const gameController = require("./controller/game");
const GameServer = require("./models/server");
const { gameReset, destroyblock } = require("./util/game");

let admins = [{ username: "pal", password: "12345" }];
let onlineUsers = 0;
let intervalId;

const clients = {};

app.use(urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", "views");


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
    const numClinets = Object.keys(clients).length;

    const rooms = Object.keys(state).map((code) => {
      return {
        code: code,
        prisoner: state[code]["prisoner"].id,
        warder: state[code]["warder"].id,
      };
    });

    res.render("admin", {
      rooms: rooms,
      numClients: numClinets,
    });
  } else {
    res.redirect("/");
  }
});

app.get("/reset/:code", (req, res) => {
  const gameCode = req.params.code;
  const gameState = GameServer.getAllState();
  const rooms = GameServer.getAllRoom();
  delete clients[gameState[gameCode]["prisoner"].id];
  delete clients[gameState[gameCode]["warder"].id];
  delete rooms[gameState[gameCode]["prisoner"].id];
  delete rooms[gameState[gameCode]["warder"].id];
  delete gameState[gameCode];

  //return to home page
  io.in(gameCode).emit("reset");
  res.redirect("/");
});

io.on("connection", (socket) => {
  // tell other clients that you joined
  console.log(socket.id, "user connected");
  socket.on("greeting", (username) => {
    console.log("greeting", username);
    clients[socket.id] = username;
    socket.broadcast.emit("userJoin", { name: username });
  });

  socket.on("requestUserList", () => {
    const rooms = GameServer.getAllRoom();
    let clientList = Object.keys(clients).filter((id) => {
      return id !== socket.id && !rooms[id];
    });

    clientList = clientList.map((id) => {
      return { name: clients[id] };
    });

    socket.emit("userList", JSON.stringify({ clientList: clientList }));
  });

  // invited other users
  socket.on("inviteUser", ({ name, gameCode }) => {
    const userIndex = Object.keys(clients).findIndex((id) => {
      return clients[id] === name;
    });

    const fromUser = clients[socket.id];
    const id = Object.keys(clients)[userIndex];
    socket.to(id).emit("invite", { fromUser: fromUser, gameCode: gameCode });
  });

  socket.on("acceptInvite", (gameCode) => {
    roomController.joinGame(socket, gameCode);
  });

  socket.on("selectedChar", (char) => {
    const gameCode = GameServer.getGameRoom(socket.id);
    const gameState = GameServer.getState(gameCode);
    gameState.selectedChar = char;
  });

  onlineUsers++;
  io.emit("onlineUsers", onlineUsers);

  socket.on("disconnect", () => {
    onlineUsers--;
    console.log(socket.id, "socket disconnect");
    io.emit("onlineUsers", onlineUsers);

    const state = GameServer.getAllState();
    const rooms = GameServer.getAllRoom();
    const gameCode = rooms[socket.id];

    delete state[gameCode];
    delete rooms[socket.id];
    delete clients[socket.id];

  });

  socket.on("chatMessage", ({ name, message }) => {
    io.emit("chatMessage", { name, message });
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
    gameState.timer = 10;
    return io.in(gameCode).emit("destroyBlock", JSON.stringify(gameState));
  });

  socket.on("play", (data) => {
    const winner = gameController.play(socket, data);
    const gameCode = GameServer.getGameRoom(socket.id);
    let gameState = GameServer.getState(gameCode);
    if (!winner) {
      // continue game
      console.log("continue game in game loop");
      gameState.turn = !gameState.turn;
      gameState.timer = 10;
      return io.in(gameCode).emit("gameContinue", JSON.stringify(gameState));
    } else if (winner === 1) {
      //  prisoner win this round
      gameState["prisoner"].win += 1;
      if (gameState["prisoner"].win === 3) {
        io.sockets
          .to(gameState["prisoner"].id)
          .emit("gameWinner", "You win !!!!!!!!!");
        io.sockets
          .to(gameState["warder"].id)
          .emit("gameWinner", "you lose !!!!!!!!!");
        // gameState = {};
        delete gameState;
        return;
      }
      gameState = gameReset(gameState, "prisoner");
      // timer  = 10
      gameState.timer = 10;
      return io.in(gameCode).emit("prisonerWin", JSON.stringify(gameState));
    } else if (winner === 2) {
      // warder win this round
      gameState["warder"].win += 1;
      if (gameState["warder"].win === 3) {
        io.sockets
          .to(gameState["prisoner"].id)
          .emit("gameWinner", "You lose !!!!!!!!!");
        io.sockets
          .to(gameState["warder"].id)
          .emit("gameWinner", "you win !!!!!!!!!");
        // gameState = {};
        delete gameState;
        return;
      }
      gameState = gameReset(gameState, "warder");
      // timer = 10;
      gameState.timer = 10;

      return io.in(gameCode).emit("warderWin", JSON.stringify(gameState));
    }
  });

  socket.on("ready", () => {
    const gameCode = GameServer.getGameRoom(socket.id);
    const gameState = GameServer.getState(gameCode);
    io.in(gameCode).emit("gameStart", JSON.stringify(gameState));
    console.log(socket.id, "user emit ready");

    intervalId = setInterval(() => {
      gameState.timer -= 1;
      io.in(gameCode).emit("updateTimer", gameState.timer);
      if (gameState.timer === 0) {
        gameState.timer = 10;
        gameState.turn = !gameState.turn;
        io.in(gameCode).emit("switchTurn", gameState.turn);
      }
    }, 1000);
  });

  socket.on("endgame", (gameCode) => {
    clearInterval(intervalId);

    /* clean up */
    delete GameServer.getAllState()[gameCode];
    delete GameServer.getAllRoom()[socket.id];
    delete clients[socket.id];
  });

  socket.on("surrender", ({ gameCode, myRole }) => {
    const gameState = GameServer.getState(gameCode);
    console.log(gameState, gameCode);

    const loser =
      myRole === "prisoner" ? gameState["prisoner"].id : gameState["warder"].id;
    const winner =
      myRole === "prisoner" ? gameState["warder"].id : gameState["prisoner"].id;

    delete GameServer.getAllRoom()[winner];
    delete GameServer.getAllRoom()[loser];
    delete GameServer.getAllState()[gameCode];
    delete clients[winner];
    delete clients[loser];

    io.sockets.to(winner).emit("surrenderResult", "you win!!!!!!!!");
    io.sockets.to(loser).emit("surrenderResult", "you lose!!!!!!!!");
  });

  socket.on("chat message", (recipientUserName, messageContent) => {
    //get all clients (socketIds) of recipient
    let recipientSocketIds = userSocketIdMap.get(recipientUserName);
    for (let socketId of recipientSocketIds) {
      io.to(socketId).emit("new message", messageContent);
    }
  });
});
