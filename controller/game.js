const uniqid = require("uniqid");
const GameServer = require("../models/game-server");
const GameState = require("../models/game-state");
exports.createGame = (socket) => {
  //   console.log(socket);
  const gameCode = uniqid();
  const state = GameState.createGameState(socket.id);
  const room = GameServer.setGameRoom(socket.id, gameCode);
  const updatedState = GameServer.setState(gameCode, state.gameState);
  console.log(room, state);
  const rv = { message: "This is ypur game code : " + gameCode };
  socket.join(gameCode, () => {
    socket.emit("newGame", "This is your game code : " + gameCode);
  });
};

exports.joinGame = (socket, gameCode) => {
  const io = require("../socket").getIO();
  const room = io.sockets.adapter.rooms[gameCode];
  if (room) {
    allUsers = room.sockets;
  }
  let allUsers;
  let numClients = 0;
  if (allUsers) {
    numClients = Object.keys(allUsers).length;
  }
  let errMessage;
  if (numClients === 0) {
    // room is not existed
    errMessage = "Room" + gameCode + "does not existed";
  } else if (numClients > 1) {
    // room is full
    errMessage = "Room" + gameCode + "is full";
  } else {
    return socket.join(gameCode, () => {
      // return state and role to user
      const state = GameServer.getState(gameCode);
      const role = state.remainingRole;
      state[role] = { id: socket.id, pos: { x: 1, y: 1 } };
      state.remainingRole = "";
      const updatedState = GameServer.setState(gameCode, state);

      const rv = JSON.stringify({
        message: "You are in room " + gameCode,
        gameState: updatedState,
        role: role,
      });
      return socket.emit("joinSuccess", rv);
    });
  }
};

exports.assignBlock = (socket, input) => {
  const io = require("../socket").getIO();
  const convertedInput = JSON.parse(input);
  const gameCode = convertedInput.gameCode;
  const blocks = convertedInput.blocks;
  const state = GameServer.getState(gameCode);
  state.blocks = blocks;
  GameServer.setState(state);
  return io.in(gameCode).emit("finishSetup", state);
};
