// state[gameCode] = GameState.creategamestate()
let state = {};
// gameRooms[socket.id] = gameCode
let gameRooms = {};

module.exports = {
  setGameRoom: (id, gameCode) => {
    gameRooms[id] = gameCode;
    return gameRooms[id];
  },
  getGameRoom: (id) => {
    return gameRooms[id];
  },
  setState: (gameCode, gameState) => {
    state[gameCode] = gameState;
    return state[gameCode];
  },
  getState: (gameCode) => {
    return state[gameCode];
  },
};
