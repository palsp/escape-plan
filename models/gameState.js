const { randomPos } = require("../util/pos");

class GameState {
  warder = {};
  prisoner = {};
  tunnel = {};
  blocks = [];
  turn = "";
  remainingRole = "";

  static createGameState(id) {
    const rv = new GameState();
    const randomNum = Math.floor(Math.random() * 2);
    const role = randomNum === 0 ? "warder" : "prisoner";
    rv[role].id = id;
    rv[role].pos = randomPos();
    rv.remainingRole = role === "warder" ? "prisoner" : "warder";
    rv.turn = "prisoner";
    return rv;
  }
}

module.exports = GameState;