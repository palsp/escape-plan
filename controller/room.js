const uniqid = require("uniqid");
const GameServer = require("../models/server");
const GameState = require("../models/gameState");
const { randomPos, isEqualPos, isInArrayOf } = require("../util/pos");

exports.createGame = (socket) => {
  const gameCode = uniqid();
  // create Game State and store it at backend database
  const state = GameState.createGameState(socket.id);
  GameServer.setGameRoom(socket.id, gameCode);
  GameServer.setState(gameCode, state);

  // this user role
  let currentUserRole = "prisoner";
  if (state["prisoner"].id !== socket.id) {
    currentUserRole = "warder";
  }

  socket.join(gameCode, () => {
    socket.emit(
      "newGame",
      JSON.stringify({
        gameCode: gameCode,
        myRole: currentUserRole,
        state: state,
      })
    );
  });
};

exports.joinGame = (socket, gameCode) => {
  const io = require("../socket").getIO();
  // console.log(gameCode);
  const room = io.sockets.adapter.rooms[gameCode];
  let allUsers;
  if (room) {
    allUsers = room.sockets;
  }
  let numClients = 0;
  if (allUsers) {
    numClients = Object.keys(allUsers).length;
  }
  let errMessage;
  if (numClients === 0) {
    // room is not existed
    errMessage = "Room " + gameCode + " does not existed";
  } else if (numClients > 1) {
    // room is full
    errMessage = "Room" + gameCode + "is full";
  } else {
    return socket.join(gameCode, () => {
      // return state and role to user
      const state = GameServer.getState(gameCode);
      GameServer.setGameRoom(socket.id, gameCode);
      const role = state.remainingRole;
      // state[role] = { id: socket.id, pos: { x: 1, y: 1 } };
      state[role].id = socket.id;
      opponentRole = role === "prisoner" ? "warder" : "prisoner";
      const opponentPos = state[opponentRole].pos;
      while (true) {
        const newPos = randomPos();
        if (newPos.x !== opponentPos.x && newPos.y !== opponentPos.y) {
          state[role].pos = newPos;
          break;
        }
      }
      console.log("joinRoom", numClients);
      state[role].win = 0;
      state.remainingRole = "";
      // random tunnel pos
      while (true) {
        // state.tunnel = randomPos();
        const tunnel = randomPos();
        if (
          !isEqualPos(tunnel, state["warder"].pos) &&
          !isEqualPos(tunnel, state["prisoner"].pos)
          //state.tunnel not equal to state.block
        ) {
          state.tunnel = tunnel;
          break;
        }
      }
      // check block not equal to states of tunnel/warder/prisoner
      // block must be at least 2*GRID_WIDTH distance apart
      let blocks = [];
      for (let i = 0; i < 5; i++) {
        let block;
        while (true) {
          block = randomPos();

          if (
            !isInArrayOf(block, blocks) &&
            !isEqualPos(block, opponentPos) &&
            !isEqualPos(block, state[role].pos) &&
            !isEqualPos(block, state.tunnel)
          ) {
            blocks.push(block);
            break;
          }
        }
      }

      state.blocks = blocks;
      // console.log("--------------Final State-----------------");
      // console.log("prisoner", state["prisoner"].pos);
      // console.log("warder", state["warder"].pos);
      // console.log("tunnel", state.tunnel);
      // console.log("blocks", state.blocks);
      // console.log("--------------------------------------------");
      const updatedState = GameServer.setState(gameCode, state);
      // console.log(updatedState);
      const rv = JSON.stringify({
        message: "You are in room " + gameCode,
        state: updatedState,
        gameCode: gameCode,
        myRole: role,
      });

      socket.emit("joinSuccess", rv);
      // return io.in(gameCode).emit("gameStart", JSON.stringify(updatedState));
      // return io.in(gameCode).emit("gameStart", JSON.stringify(updatedState));
    });
  }
  return socket.emit("err", JSON.stringify({ message: errMessage }));
};

// rooms = [{
// id : gameCode
// }]
//rooms[socket.id] = gameCode
exports.getAllRoom = (socket) => {
  const io = require("../socket").getIO();
  let rooms = { ...GameServer.getAllRoom() };
  const clients = Object.keys(rooms);

  rooms = [];

  for (let client of clients) {
    const room = GameServer.getGameRoom(client);
    if (!rooms.includes(room)) {
      rooms.push(room);
    }
  }

  rooms = rooms.map((gameCode) => {
    const room = io.sockets.adapter.rooms[gameCode];
    let allUsers;
    if (room) {
      allUsers = room.sockets;
    }
    let numClients = 0;
    if (allUsers) {
      numClients = Object.keys(allUsers).length;
    }
    return { code: gameCode, numClients: numClients };
  });

  console.log("rooms", rooms);
  socket.emit("getAllRoom", JSON.stringify({ rooms: rooms }));
};