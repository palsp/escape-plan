exports.startgame = (socket, gameState) => {};

const { getAllRoom, getAllState } = require("../models/game-server");
const GameState = require("../models/game-state");
require("dotenv");

exports.gameLoop = (gameCode, role, move) => {
  const state = getAllState();
  console.log(state);
  const pos1 = { ...state[gameCode][role].pos };
  const oppoRole = role === "prisoner" ? "warder" : "prisoner";
  const pos2 = { ...state[gameCode][oppoRole].pos };

  const block = { ...state }[gameCode].blockPos;
  const win = { ...state }[gameCode].winPos;
  let vel;
  switch (move) {
    // left
    case 65:
      vel = { x: -100, y: 0 };
      break;
    //up
    case 87:
      vel = { x: 0, y: 100 };
      break;
    //right
    case 68:
      vel = { x: 100, y: 0 };
      break;
    //down
    case 83:
      vel = { x: 0, y: -100 };
      break;
    default:
      vel = { x: 0, y: 0 };
  }
  pos1.x += vel.x;
  pos1.y += vel.y;
  //   console.log(vel);
  let winner;
  //   console.log(pos1);
  // 0 = game over  , 1 = warder win , 2 = prisoner win
  if (
    pos1.x < 0 ||
    pos1.y < 0 ||
    pos1.x > process.env.GRID_SIZE ||
    process.env.GRID_SIZE
  ) {
    return 0;
  }

  if (pos1.x === pos2.x && pos1.y === pos2.y) {
    return 1;
  }

  if (pos1 === "prisoner" && pos1.x === win.x && pos1.y === pos2.y) {
    return 2;
  }

  if (block.includes(pos1)) {
    return 0;
  }
  state[gameCode][role].pos.x = pos1.x;
  state[gameCode][role].pos.y = pos1.y;

  //   return winner;
  return {
    // winner: winner,
    pos1: pos1,
    pos2: pos2,
    oppoRole: oppoRole,
    block: block,
    win: win,
  };
};
