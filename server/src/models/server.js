// state[gameCode] = GameState.creategamestate()
const state = {};
// gameRooms[socket.id] = gameCode
const gameRooms = {};

//clients[socket.id] = username
const clients = {};

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
  getAllRoom: () => {
    return gameRooms;
  },
  getAllState: () => {
    return state;
  },

  getAllClients: () => {
    return clients;
  },

  setClient: (id, name) => {
    clients[id] = name;
    return clients;
  },
};
