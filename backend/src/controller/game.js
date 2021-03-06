const GameServer = require("../models/server");
const { gameLoop } = require("../util/game");

exports.gameStart = (socket, gameCode) => {
  const io = require("../socket").getIO();
  const gameState = GameServer.getState(gameCode);
  io.in(gameCode).emit("gameStart", JSON.stringify(gameState));

  let timer = 10;

  exports.timeControl = (socket) => {
    const IntervalId = setInterval(() => {
      timer -= 1;
      io.in(gameCode).emit("updateTimer", timer);
      if (timer === 0) {
        gameState.turn = !gameState.turn;
        io.in(gameCode).emit("switchTurn", gameState.turn);
        timer = 10;
      }
    }, 1000);
  };
};

exports.play = (socket, data) => {
  console.log("in play");
  const transformedState = JSON.parse(data);
  const role = transformedState.myRole;
  const move = transformedState.keyPress;
  const gameCode = transformedState.gameCode;
  const gameState = GameServer.getState(gameCode);
  const turn = gameState.turn;
  if ((turn && role !== "warder") || (!turn && role !== "prisoner")) {
    return;
  }

  return gameLoop(gameCode, socket.id, move);
};
