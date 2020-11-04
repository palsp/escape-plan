const express = require("express");
const { set } = require("mongoose");
const app = express();
const server = app.listen(3000);
const io = require("socket.io")(server);
const { gameLoop } = require("./middleware/gameLoop");

// state[gameCode] = GameState.creategamestate()
const state = {};
// gameRooms[socket.id] = gameCode
const gameRooms = {};

io.on("connection", (client) => {
  client.emit("init");

  // client.on("createNewGame")
  client.on("joinRoom", (gameCode) => {
    // check room
    // user join , emit to sender only
  });
  client.on("gameStart", (gameCode) => {
    client.on("assignBlock", (res, gameCode) => {
      const blocks = JSON.parse(res).blocks;
      for (let b of blocks) {
        b.map((i) => {
          return +i;
        });
        let vel = { x: 0, y: 0 };
        for (let key of b) {
          let move;
          switch (b) {
            // left
            case 37:

            //up
            case 38:

            //right
            case 39:

            //down
            case 40:
          }

          pos = { ...vel };
          pos.x += move.x;
          pos.y += move.y;

          if (
            pos.x < 0 ||
            pos.y < 0 ||
            pos.x > process.env.GRID_SIZE ||
            process.env.GRID_SIZE
          ) {
            continue;
          } else {
            vel.x = pos.x;
            vel.y = pos.y;
          }
        }
        state[gameCode].blockPos.push(vel);
      }
    });
    startInterval(client, state[gameCode]);
  });
});

const startInterval = (socket, gameState) => {
  let nextRole = "prisoner";
  const intervalId = setInterval(() => {
    socket.on("move", (move) => {
      // check socket
      const gameCode = gameRooms[socket.id];
      const roomState = state[gameCode];
      if (gameState !== roomState) {
        socket.emit("err", JSON.stringify({ message: "Not authenticated" }));
        return;
      }
      // check if role is valid
      const userState =
        socket.id.toString() === roomState.prisoner.id.toString()
          ? "prisoner"
          : "warder";
      if (userState !== nextRole) {
        socket.emit("err", JSON.stringify({ message: "Not authenticated" }));
        return;
      }
      // currentPos = { x:0 , y:0}
      // const currentPos = roomState[userState].pos

      // 0 = game over  , 1 = warder win , 2 = prisoner win
      const winner = gameLoop(gameCode, gameState, userState);
      if (!winner) {
        io.sockets
          .in(gameCode)
          .emit("gameState", JSON.stringify(state[gameCode]));
      }
      if (winner === 0) {
        socket.emit(
          "invalidMove",
          JSON.stringify({
            message: "your move is invalid",
            gameState: gameState,
          })
        );
        continue;
      } else {
        let winRole;
        switch (winner) {
          case 1:
            winRole = "warder";
          case 2:
            winRole = "prisoner";
        }

        io.sockets
          .in(gameCode)
          .emit("gameResult", JSON.stringify({ winner: winRole }));
        clearInterval(intervalId);
      }

      nextRole = nextRole === "prisoner" ? "warder" : "prisoner";
    });
  }, 10000);
};

const gameLoop = (gameCode, role) => {
  //   const currentPos = state[gameCode][userState].pos;
  const pos1 = { ...state }[gameCode][role].pos;
  const oppoRole = role === "prisoner" ? "prisoner" : "warder";
  const pos2 = { ...state }[gameCode][oppoRole].pos;
  const block = { ...state }[gameCode].blockPos;
  const win = { ...state }[gameCode].winPos;

  let vel = { x: 10, y: 10 };
  switch (move) {
    // left
    case 37:

    //up
    case 38:

    //right
    case 39:

    //down
    case 40:
  }
  pos1.x += vel.x;
  pos1.y += vel.y;
  let winner;

  // 0 = game over  , 1 = warder win , 2 = prisoner win
  if (
    pos.x < 0 ||
    pos.y < 0 ||
    pos.x > process.env.GRID_SIZE ||
    process.env.GRID_SIZE
  ) {
    return 0;
  }

  if (pos1 === pos2) {
    return 1;
  }

  if (pos1 === "prisoner" && pos1 === win) {
    return 2;
  }

  if (block.includes(pos1)) {
    return 0;
  }
  state[gameCode][role].pos.x = pos1.x;
  state[gameCode][role].pos.y = pos1.y;

  return winner;
};
