import React, { useState, useEffect } from "react";
import Socket from "../../Socket";
import Timer from "../../components/Timer/Timer";
import Tunnel from "../../components/Tunnel/Tunnel";
import Blocks from "../../components/Blocks/Blocks";
import Player from "../../components/Player/Player";
import Turn from "../../components/Turn/Turn";
import Aux from "../../hoc/Aux";
import "./GameArea.css";
import "./GameArea2.css";
import clock from "./clock.png"

function GameArea2({ history, location }) {
  const info = location.state;
  const [socket, setSocket] = useState(Socket.getClient());
  // get properties from server
  // warder = true , prisoner = false
  const [gameState, setGameState] = useState();

  const [winCount, setWinCount] = useState(0);
  const [myRole, setMyRole] = useState(info.myRole);

  const [gameStart, setGameStart] = useState(false);

  const [turn, setTurn] = useState();

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("gameStart", (msg) => {
  //       const rcvState = JSON.parse(msg);
  //       setGameState({ ...rcvState });
  //       setTurn(rcvState.turn);
  //       setGameStart(true);
  //     });
  //   }
  // });

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
  }, [turn, gameState, myRole]);

  useEffect(() => {
    if (socket) {
      socket.on("gameStart", (msg) => {
        const rcvState = JSON.parse(msg);
        setGameState({ ...rcvState });
        setTurn(rcvState.turn);
        setGameStart(true);
        setWinCount(rcvState[myRole].win);
      });
    }
  });

  useEffect(() => {
    socket.on(
      "gameContinue",
      (serverState) => {
        const updatedState = JSON.parse(serverState);
        setGameState(updatedState);
        setTurn(updatedState.turn);
      },
      [turn]
    );

    socket.on("prisonerWin", (serverState) => {
      alert("prisoner win");
      const updatedState = JSON.parse(serverState);
      console.log("prisoner win", updatedState);
      console.log(socket.id);
      const newRole =
        socket.id === updatedState["prisoner"].id ? "prisoner" : "warder";
      setGameState(updatedState);
      setTurn(updatedState.turn);
      setMyRole(newRole);
      const winCount = updatedState[newRole].win;
      setWinCount(winCount);
    });

    socket.on("warderWin", (serverState) => {
      alert("warder win");
      const updatedState = JSON.parse(serverState);
      console.log("warder win", updatedState);
      console.log(socket.id);
      const newRole =
        socket.id === updatedState["prisoner"].id ? "prisoner" : "warder";
      setGameState(updatedState);
      setTurn(updatedState.turn);
      setMyRole(newRole);
      const winCount = updatedState[newRole].win;
      setWinCount(winCount);
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
    header = <h2> Your game code is : {info.gameCode}</h2>;
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
    <div className="playhome">
      <div className="content1">
      <img src={clock} className="clock" width="95" ></img>
      <h3>Your Role is : {myRole}</h3>
      {header}
      <h3>Win Count : {winCount}</h3>
      <Turn turn={turn} />
      </div>

      <div className="game-area">{gameArea}</div>
      </div>
  
    
  );
}

export default GameArea2;
