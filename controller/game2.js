const GameServer = require("../models/server");
const { gameLoop } = require("../util/game");

exports.gameStart = (socket, gameCode) => {
  const io = require("../socket").getIO();
  const gameState = GameServer.getState(gameCode);
  io.in(gameCode).emit("gameStart", JSON.stringify(gameState));

  let timer = 10;
<<<<<<< HEAD
  setInterval(() => {
    timer -= 1;
    socket.emit("timer", timer);
    if (timer === 0) {
      gameState.turn = !gameState.turn;
      // switch turn
      timer = 10;
    }
  }, 1000);

  socket.on("play", state => {
    const transformedState = JSON.parse(state);
    const role = transformedState.myRole;
    const move = transformedState.move;
    const turn = gameState.turn;
    if ((turn && role !== "warder") || (!turn && role !== "prisoner")) {
      return;
    }
=======

  exports.timeControl = (socket) => {
    const IntervalId = setInterval(() => {
      timer -= 1;
      socket.emit("updateTimer", timer);
      if (timer === 0) {
        gameState.turn = !gameState.turn;
        socket.emit("switchTurn", gameState.turn);
        timer = 10;
      }
    }, 1000);
  };
};

exports.play = (socket, data) => {
  const transformedState = JSON.parse(data);
  const role = transformedState.myRole;
  const move = transformedState.keyPress;
  const gameCode = transformedState.gameCode;
  const gameState = GameServer.getState(gameCode);
  const turn = gameState.turn;
  console.log("in play", role, move, turn);
  if ((turn && role !== "warder") || (!turn && role !== "prisoner")) {
    return;
  }
>>>>>>> 60eca29885ed39900a56720c83de2256b611bb34

  gameLoop(gameCode, socket.id, move);
};
