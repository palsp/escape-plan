// // state[gameCode] = GameState.creategamestate()
// const state = {};
// // gameRooms[socket.id] = gameCode
// const gameRooms = {};

const state = {
  abc: {
    warder: {
      id: "123",
      pos: {
        x: 0,
        y: 0,
      },
    },
    prisoner: {
      id: "456",
      pos: {
        x: 0,
        y: 1,
      },
    },
    winPos: {
      x: 50,
      y: 50,
    },
    blockPos: [
      { x: 5, y: 5 },
      { x: 15, y: 15 },
      { x: 20, y: 20 },
      { x: 25, y: 25 },
      { x: 30, y: 30 },
    ],
  },
};
const gameRooms = {
  123: "abc",
  456: "abc",
};

exports.gameLoop = (gameCode, role, move) => {
  const pos1 = { ...state[gameCode][role].pos };
  const oppoRole = role === "prisoner" ? "warder" : "prisoner";
  const pos2 = { ...state[gameCode][oppoRole].pos };

  const block = { ...state }[gameCode].blockPos;
  const win = { ...state }[gameCode].winPos;
  let vel;
  switch (move) {
    // left
    case 37:
      vel = { x: -1, y: 0 };
      break;
    //up
    case 38:
      vel = { x: 0, y: 1 };
      break;
    //right
    case 39:
      vel = { x: 1, y: 0 };
      break;
    //down
    case 40:
      vel = { x: 0, y: -1 };
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
