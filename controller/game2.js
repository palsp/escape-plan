const GameServer = require("../models/server");
const { gameLoop } = require("../util/game");

exports.gameStart = (socket, gameCode) => {
  const gameState = GameServer.getState(gameCode);
  let timer = 10;
  setInterval(() => {
    timer -= 1;
    socket.emit("timer", timer);
    if (timer === 1) {
      gameState.turn = !gameState.turn;

      timer = 10;
    }
  }, 1000);

  socket.on("play", (state) => {
    const transformedState = JSON.parse(state);
    const role = transformedState.myRole;
    const move = transformedState.move;
    const turn = gameState.turn;
    if ((turn && role !== "warder") || (!turn && role !== "prisoner")) {
      return;
    }

    const result = gameLoop(gameCode, socket.id, move);
    if (result) {
      timer = 10;
    }
  });
};
