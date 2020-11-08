const GameServer = require("../models/server");
const Validation = require("../util/pos");

const swapRole = (gameState) => {
  const helper = gameState["prisoner"];
  gameState["prisoner"] = gameState["warder"];
  gameState["warder"] = helper;
};

const gameReset = (gameState, winner) => {
  // role of the next round starter is  the same as role of the winner of this round
  gameState.turn = winner === "warder" ? true : false;
  swapRole(gameState);
  gameState["prisoner"].pos = Validation.randomPos();

  // reset warder position
  // should not equal to warder
  while (true) {
    const warderPos = Validation.randomPos();
    if (!Validation.isEqualPos(warderPos, gameState["prisoner"].pos)) {
      gameState["warder"].pos = warderPos;
      break;
    }
  }

  // reset tunnel position
  // should not equal to warder's and prisoner position
  while (true) {
    const tunnel = Validation.randomPos();
    if (
      !Validation.isEqualPos(tunnel, gameState["warder"].pos) &&
      !Validation.isEqualPos(tunnel, gameState["prisoner"].pos)
    ) {
      gameState.tunnel = tunnel;
      break;
    }
  }

  // reset block position
  const blocks = [];
  for (let i = 0; i < 5; i++) {
    let block = Validation.randomPos();
    while (
      Validation.isInArrayOf(block, blocks) ||
      Validation.isEqualPos(block, gameState["warder"].pos) ||
      Validation.isEqualPos(block, gameState["prisoner"].pos) ||
      Validation.isEqualPos(block, gameState.tunnel)
    ) {
      block = Validation.randomPos();
    }
    blocks.push(block);
  }
  gameState.blocks = blocks;
};

exports.isValidMove = (player, blocks, move) => {
  // check if new move is valid( in bound and not blocks
  let vel;
  switch (move) {
    case "a": // left
      vel = { x: -100, y: 0 };
      break;
    case "w": // up
      vel = { x: 0, y: 100 };
      break;
    case "d": // right
      vel = { x: 100, y: 0 };
      break;
    case "s": // down
      vel = { x: 0, y: -100 };
      break;
    default:
      vel = { x: 0, y: 0 };
  }

  const newPos = { ...player.pos };
  newPos.x += vel.x;
  newPos.y = vel.y;

  if (
    newPos.x <= 0 ||
    newPos.y <= 0 ||
    newPos.x >= +process.env.GRID_SIZE ||
    newPos.y >= +process.env.GRID_SIZE
  ) {
    return;
  }

  if (Validation.isInArrayOf(newPos, blocks)) {
    return;
  }

  return newPos;
};

exports.isWinner = (prisoner, warder, tunnel) => {
  // null = continue , 1 = prisoner win , 2 = warder win

  if (prisoner.pos.x === tunnel.x && prisoner.pos.y === tunnel.y) {
    // prisoner reach the tunnel
    return 1;
  }

  if (prisoner.pos.x === warder.pos.x && prisoner.pos.y === warder.pos.y) {
    // prisoner and warder are on the same position
    return 2;
  }

  return null;
};

exports.gameLoop = (gameCode, id, move) => {
  const gameState = GameServer.getState(gameCode);
  // find current player
  let player =
    id === gameState["prisoner"].id
      ? gameState["prisoner"]
      : gameState["warder"];
  const newMove = this.isValidMove(player, gameState.blocks, move);
  if (!newMove) {
    // invalid move
    return null;
  }
  player.pos = newMove;

  const winner = this.isWinner(
    gameState["prisoner"],
    gameState["warder"],
    gameState.tunnel
  );

  if (!winner) {
    // continue game
    gameState.turn = !gameState.turn;
    return io.in(gameCode).emit("gameContinue", JSON.stringify(gameState));
  } else if (winner === 1) {
    //  prisoner win this round
    gameState["prisoner"].win += 1;
    if (gameState["prisoner"].win === 3) {
      gameState = {};
      return io.in(gameCode).emit(
        "gameWinner",
        JSON.stringify({
          myRole: "warder",
          winMsg: "Congratulation!!!",
          loseMsg: "You lose!!!!!",
        })
      );
    }
    gameReset(gameState, "prisoner");
    return io.in(gameCode).emit("warderWin", JSON.stringify(gameState));
  } else if (winner === 2) {
    // warder win this round
    gameState["prisoner"].win += 1;
    if (gameState["prisoner"].win === 3) {
      gameState = {};
      // clear game Room
      return io.in(gameCode).emit("gameWinner", {
        myRole: "prisoner",
        winMsg: "Congratulation!!!",
        loseMsg: "You lose!!!!!",
      });
    }
    gameState = gameReset(gameCode, "prisoner");
    return io.in(gameCode).emit("prisonerWin", JSON.stringify(gameState));
  }
};
