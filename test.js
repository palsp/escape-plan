const CheckPos = require("./util/pos");

let gameState = {
  prisoner: {
    id: "123",
    pos: {},
    win: 0,
  },
  warder: {
    id: "456",
    pos: {},
    win: 0,
  },
  tunnel: { x: 100, y: 200 },
  blocks: [{}],
  turn: true,
};

const gameReset = (winner) => {
  const starter = winner === "prisoner" ? "prisoner" : "warder";
  gameState = swapRole(starter);

  //reset prisoner position
  gameState["prisoner"].pos = CheckPos.randomPos();

  // reset warder position
  // should not equal to warder
  while (true) {
    const warderPos = CheckPos.randomPos();
    if (!CheckPos.isEqualPos(warderPos, gameState["prisoner"].pos)) {
      gameState["warder"].pos = warderPos;
      break;
    }
  }

  // reset tunnel position
  // should not equal to warder's and prisoner position
  while (true) {
    const tunnel = CheckPos.randomPos();
    if (
      !CheckPos.isEqualPos(tunnel, gameState["warder"].pos) &&
      !CheckPos.isEqualPos(tunnel, gameState["prisoner"].pos)
    ) {
      gameState.tunnel = tunnel;
      break;
    }
  }

  // reset block position
  const blocks = [];
  for (let i = 0; i < 5; i++) {
    let block = CheckPos.randomPos();
    while (
      CheckPos.isInArrayOf(block, blocks) ||
      CheckPos.isEqualPos(block, gameState["warder"].pos) ||
      CheckPos.isEqualPos(block, gameState["prisoner"].pos) ||
      CheckPos.isEqualPos(block, gameState.tunnel)
    ) {
      block = CheckPos.randomPos();
    }
    blocks.push(block);
  }
  gameState.blocks = blocks;
  return gameState;
};

const swapRole = (starter) => {
  //   const gameState = { ...GameServer.getState(gameCode) };
  //   const gameState = state[gameCode];
  const helper = gameState["prisoner"].id;
  gameState["prisoner"].id = gameState["warder"].id;
  gameState["warder"].id = helper;
  gameState.turn = starter === "warder" ? true : false;
  return gameState;
};

const updatedState = gameReset("abc", "prisoner");
console.log(updatedState);
