const GameState = require("../models/gameState");
const GameServer = require("../models/server");
const CheckPos = require("../util/pos");
const Socket = require("../socket");
require("dotenv").config();

exports.validateMove = (socket, msg) => {
  const transformedInput = JSON.parse(msg);
  const gameCode = transformedInput.gameCode;
  const io = Socket.getIO();

  // a w s d
  const keyPress = transformedInput.keyPress;
  let gameState = GameServer.getState(gameCode);
  // console.log("getturn", gameState.turn);
  // [turn] true = warder , false = warder
  const currentTurn = gameState.turn;
  const player = currentTurn
    ? { ...gameState["warder"] }
    : { ...gameState["prisoner"] };
  const opponent = currentTurn
    ? { ...gameState["prisoner"] }
    : { ...gameState["warder"] };

  if (player.id !== socket.id) {
    // Not Authenticated
    socket.emit("err", JSON.stringify({ message: "Not authenticate" }));
    return;
  }

  // console.log("before game loop", "player", player, "opponent", opponent);
  const winner = this.gameLoop(
    gameCode,
    player.pos,
    opponent.pos,
    gameState.blocks,
    gameState.tunnel,
    keyPress,
    currentTurn
  );

  // [winner] null = continue , 1 = warder win this round
  // 2 = prisoner win this round
  // 3 = have one person win three round
  // 0 = invalid move
  let message;
  if (!winner) {
    // console.log("before game con", gameState["prisoner"].pos);
    console.log("before shift", gameState.turn);
    gameState.turn = !gameState.turn;
    console.log("After shift", gameState.turn);
    return io.in(gameCode).emit("gameContinue", JSON.stringify(gameState));
  } else if (winner === 0) {
    // invalidMove
    return io.in(gameCode).emit("invalidMove", JSON.stringify(gameState));
  } else if (winner === 1) {
    // warder win
    gameState["warder"].win += 1;
    if (gameState["warder"].win === 3) {
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
    gameState = gameReset(gameCode, "warder");
    return io.in(gameCode).emit("warderWin", JSON.stringify(gameState));
  } else if (winner === 2) {
    // prisoner win
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
    // const helper = gameState["warder"];
    // gameState["warder"] = gameState["prisoner"];
    // gameState["prisoner"] = helper;
    // gameState.turn = false;
    gameState = gameReset(gameCode, "prisoner");
    return io.in(gameCode).emit("prisonerWin", JSON.stringify(gameState));
  }
};

exports.gameLoop = (gameCode, player, opponent, blocks, tunnel, move, turn) => {
  /* CALCULATE MOVE */
  let vel;
  switch (move) {
    // left
    case "a":
      vel = { x: -100, y: 0 };
      break;

    //up
    case "w":
      vel = { x: 0, y: 100 };
      break;

    //right
    case "d":
      vel = { x: 100, y: 0 };
      break;

    //down
    case "s":
      vel = { x: 0, y: -100 };
      break;

    default:
      vel = { x: 0, y: 0 };
  }

  // ----------------------------------------------------------------

  const pos = { ...player };
  pos.x += vel.x;
  pos.y += vel.y;
  if (
    pos.x < 0 ||
    pos.y < 0 ||
    pos.x > +process.env.GRID_SIZE ||
    pos.y > +process.env.GRID_SIZE
  ) {
    // invalid move
    return 0;
  }

  if (pos.x === opponent.x && pos.y === opponent.y) {
    // warder win
    return 1;
  }

  if (!turn && pos.x === tunnel.x && pos.y === tunnel.y) {
    // prisoner win
    return 2;
  }

  if (CheckPos.isInArrayOf(pos, blocks)) {
    // invalid move
    return 4;
  }
  player.x = pos.x;
  player.y = pos.y;
  return null;
};

const gameReset = (gameCode, winner) => {
  let gameState = GameServer.getState(gameCode);
  const starter = winner === "prisoner" ? "prisoner" : "warder";
  gameState = swapRole(gameCode, starter);

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

const swapRole = (gameCode, starter) => {
  const gameState = { ...GameServer.getState(gameCode) };
  const helper = gameState["prisoner"];
  gameState["prisoner"] = gameState["warder"];
  gameState["warder"] = helper;
  gameState.turn = starter === "warder" ? true : false;
  return gameState;
};
