import React, { useState, useEffect } from "react";
import Socket from "../../Socket";
import Timer from "../../components/Timer/Timer";
import Tunnel from "../../components/Tunnel/Tunnel";
import Blocks from "../../components/Blocks/Blocks";
import Player from "../../components/Player/Player";
import Turn from "../../components/Turn/Turn";
import Aux from "../../hoc/Aux";
import "./GameArea.css";

function GameArea2({ history, location }) {
  const info = location.state;
  const [socket, setSocket] = useState(Socket.getClient());

  // get properties from server
  // warder = true , prisoner = false
  const [gameState, setGameState] = useState();

  const [gameStart, setGameStart] = useState(false);

  const [turn, setTurn] = useState();

  useEffect(() => {
    if (socket) {
      socket.on("gameStart", (msg) => {
        const rcvState = JSON.parse(msg);
        setGameState({ ...rcvState });
        setTurn(rcvState.turn);
        setGameStart(true);
      });
    }
  });

  const [timer, setTimer] = useState(10);

  const checkTimeOut = () => {
    if (timer === 0) {
      setTurn((turn) => !turn);
      setTimer(10);
    }
  };
  useEffect(() => {
    checkTimeOut();
  });

  const moveValidation = (keypress, pos, blocks) => {
    let move;
    switch (keypress) {
      // left
      case "a":
        move = { x: -100, y: 0 };
        break;
      // up
      case "w":
        move = { x: 0, y: 100 };
        break;
      //down
      case "s":
        move = { x: 0, y: -100 };
        break;
      // right
      case "d":
        move = { x: 100, y: 0 };
        break;
      default:
        move = { x: 0, y: 0 };
    }

    let next = { x: pos.x + move.x, y: pos.y + move.y };

    let check = true;
    // out of bound
    if (next.x < 0 || next.y < 0 || next.x >= 500 || next.y >= 500) {
      check = false;
    }
    // block collision
    for (let b of blocks) {
      if (b.x === next.x && b.y === next.y) {
        check = false;
      }
    }

    return check;
  };

  const onKeyPressHandler = (event) => {
    // [turn] true = warder , false = prisoner
    let role = turn ? "warder" : "prisoner";
    console.log("turn ", role);
    const validmove = moveValidation(
      event.key,
      gameState[role].pos,
      gameState.blocks
    );
    console.log("validation result", validmove);
    if (validmove) {
      let data = {
        keyPress: event.key,
        myRole: info.myRole,
        gameCode: info.gameCode,
      };
      // console.log("data", data);
      socket.emit("validateMove", JSON.stringify(data));

      return window.removeEventListener("keypress", onKeyPressHandler);
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", onKeyPressHandler);

    return () => {
      window.removeEventListener("keypress", onKeyPressHandler);
    };
  }, [turn, gameState]);

  useEffect(() => {
    socket.on(
      "gameContinue",
      (serverState) => {
        console.log("gameContinue");
        const updatedState = JSON.parse(serverState);
        setGameState(updatedState);
        setTurn(updatedState.turn);
        console.log("State after game continue", JSON.parse(serverState));
      },
      [turn]
    );

    socket.on("prisonerWin", (serverState) => {
      alert("prisoner win");
      setGameState(JSON.parse(serverState));
      setTurn(JSON.parse(serverState).turn);
    });

    socket.on("warderWin", (serverState) => {
      alert("warder win");
      setGameState(JSON.parse(serverState));
      setTurn(JSON.parse(serverState).turn);
    });

    socket.on("gameWinner", (serverMsg) => {
      const msg = JSON.parse(serverMsg);
      if (info.myRole === msg.myRole) {
        alert(msg.winMsg);
      } else {
        alert(msg.loseMsg);
      }
    });
  }, []);

  let header = null;
  if (info.gameCode) {
    header = <p> Your gamCode is : {info.gameCode}</p>;
  }

  if (gameStart) {
    header = (
      <Aux>
        <Timer timer={timer} />
        {/* <Turn turn={gameState.turn} /> */}
      </Aux>
    );
  }

  let gameArea = null;
  let blocks = null;
  if (gameState) {
    if (gameState.warder.pos && gameState.prisoner.pos) {
      blocks = gameState.blocks.map((block) => {
        return <Blocks pos={block} color="black" />;
      });

      gameArea = (
        <Aux>
          <Player pos={gameState.warder.pos} color="green" />
          <Player pos={gameState.prisoner.pos} color="red" />
          {blocks};
          <Tunnel pos={gameState.tunnel} color="blue" />
        </Aux>
      );
    }
  }

  return (
    <div>
      <p>Your Role is : {info.myRole}</p>
      {header}
      <Turn turn={turn} />
      <div className="game-area">{gameArea}</div>
    </div>
  );
}

export default GameArea2;
