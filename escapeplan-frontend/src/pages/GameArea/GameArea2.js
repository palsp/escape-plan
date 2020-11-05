import React, { useState, useEffect } from "react";
import Socket from "../../Socket";
import Timer from "../../components/Timer/Timer";
import Tunnel from "../../components/Tunnel/Tunnel";
import Blocks from "../../components/Blocks/Blocks";
import Player from "../../components/Player/Player";
import Turn from "../../components/Turn/Turn";
import Aux from "../../hoc/Aux";
import "./GameArea.css";
import server from "../../../../models/server";

function GameArea2({ history, location }) {
  const info = location.state;
  console.log("info", info);
  console.log("info.turn", info.gameState.turn);
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

  const checkIfOutOfBorder = (x, y, key) => {
    // inside border
    if (key === "a" && x !== 0) {
      return true;
    }
    if (key === "w" && y !== 400) {
      return true;
    }
    if (key === "s" && y !== 0) {
      return true;
    }
    if (key === "d" && x !== 400) {
      return true;
    }

    // out of border
    return false;
  };

  const checkIfEncounterBlock = (x, y, key) => {
    if (key === "a") {
      let nextPos = [x - 100, y];
      for (let i = 0; i < 5; i++) {
        if (nextPos === [gameState.blocks[i].x, gameState.blocks[i].y]) {
          console.log("cant move a");
          return false;
        }
      }
    }

    if (key === "d") {
      let nextPos = [x + 100, y];
      for (let i = 0; i < 5; i++) {
        if (nextPos === [gameState.blocks[i].x, gameState.blocks[i].y]) {
          console.log("cant move d");
          return false;
        }
      }
    }

    if (key === "w") {
      let nextPos = [x, y + 100];
      for (let i = 0; i < 5; i++) {
        if (nextPos === [gameState.blocks[i].x, gameState.blocks[i].y]) {
          console.log("cant move w");
          return false;
        }
      }
    }

    if (key === "s") {
      let nextPos = [x, y - 100];
      for (let i = 0; i < 5; i++) {
        if (nextPos === [gameState.blocks[i].x, gameState.blocks[i].y]) {
          console.log("cant move s");
          return false;
        }
      }
    }
    // block free
    return true;
  };

  const checkIfValidMove = (x, y, key) => {
    // valid move
    if (checkIfOutOfBorder(x, y, key) && checkIfEncounterBlock(x, y, key)) {
      return true;
    }
    // invalid move
    return false;
  };

  const onKeyPressHandler = (e) => {
    let validMove = false;
    if ("awsd".includes(e.key)) {
      console.log("keyyyyyyy", e.key);
      // console.log("turnnnnn", turn);

      // console.log("onKeyPressHandler", gameState);
      // warder turn
      if (turn && !validMove) {
        // console.log("warder Move");
        validMove = checkIfValidMove(
          gameState.warder.pos.x,
          gameState.warder.pos.y,
          e.key
        );
      }

      // prisoner turn
      if (!turn && !validMove) {
        // console.log("prisoner Move");
        validMove = checkIfValidMove(
          gameState.prisoner.pos.x,
          gameState.prisoner.pos.y,
          e.key
        );
        // console.log("is Valid ???", validMove);
      }
    }

    if (validMove) {
      // console.log("-0----Valid Move-0-0---0");
      let data = {
        keyPress: e.key,
        myRole: info.myRole,
        gameCode: info.gameCode,
      };
      // console.log("data", data);
      socket.emit("validateMove", JSON.stringify(data));
      setTurn(!turn);
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", onKeyPressHandler);

    return () => {
      window.removeEventListener("keypress", onKeyPressHandler);
    };
  }, [gameState]);

  useEffect(() => {
    socket.on("gameContinue", (serverState) => {
      console.log("gameContinue");
      setGameState(JSON.parse(serverState));
      setTurn(JSON.parse(serverState).turn);
      console.log("turn after set from game state", turn);
    });

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
      if (myRole === msg.myRole) {
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
          <Player pos={gameState.warder.pos} color="red" />
          <Player pos={gameState.prisoner.pos} color="green" />
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
