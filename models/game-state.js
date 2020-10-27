// exports.creategameState = (id) => {
//   const randomNum = Math.floor(Math.random() * 2);
//   const role = randomNum === 0 ? "warder" : "prisoner";
//   //random position
//   const rv = {
//     winpos: {},
//     blocks: [{}],
//   };
//   rv[role] = {
//     id: id,
//     pos: {},
//   };

//   rv.remainingRole = role === "warder" ? "prisoner" : "warder";
//   return { gameState: rv, role: role };
// };

class GameState {
  warder = {};
  prisoner = {};
  winPos = {};
  blocks = [];
  turn = "";
  remainingRole = "";

  static createGameState(id) {
    const rv = new GameState();
    const randomNum = Math.floor(Math.random() * 2);
    const role = randomNum === 0 ? "warder" : "prisoner";
    rv[role].id = id;
    rv.remainingRole = role === "warder" ? "prisoner" : "warder";
    return rv;
  }
}

module.exports = GameState;
