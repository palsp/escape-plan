import React, { useState, useEffect } from "react";
import Socket from "../../Socket";
import Timer from "../../components/Timer/Timer";
import Tunnel from "../../components/Tunnel/Tunnel";
import Blocks from "../../components/Blocks/Blocks";
import Player from "../../components/Player/Player";
import Turn from "../../components/Turn/Turn";
import Aux from "../../hoc/Aux";
import "./GameArea.css";

const gameArea = ({ history, location }) => {
  const [socket, setSocket] = useState(Socket.getClient());

  const [gameState, setGameState] = useState();

  const [winCount, setWinCount] = useState(0);

  const [myRole, setMyRole] = useState(location.state.myRole);

  const [gameStart, setGameStart] = useState(false);

  const [turn, setTurn] = useState();

  const [timer, setTimer] = useState(10);

  /*  method */
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
    if (validmove) {
      let data = {
        keyPress: event.key,
        myRole: myRole,
        gameCode: info.gameCode,
      };
      // console.log("data", data);
      socket.emit("validateMove", JSON.stringify(data));

      return window.removeEventListener("keypress", onKeyPressHandler);
    }

    /*  --------------------------------------------------------------------------------------- */

    // run every rerendering
    useEffect(() => {});

    // run only once
    useEffect(() => {
      if (socket) {
        socket.on("gameStart", (state) => {
          state = JSON.parse(data);
          setGameState(state.turn);
          setTurn(state.turn);
          setGameStart(true);
          setWinCount(state["myRole"].win);
        });

        socket.on("gameContinue", (state) => {
          state = JSON.parse(state);
          setGameState(state);
          setTurn(state.turn);
        });

        socket.on("prisonerWin", (state) => {
          state = JSON.parse(state);
          alert("prisoner win");
          setGameState(state);
          setTurn(state.turn);

          const newRole =
            state["prisoner"].id === socket.id ? "prisoner" : "warder";
          setMyRole(newRole);
          setWinCount(state[newRole].win);
        });

        socket.on("warderWin", (state) => {
          state = JSON.parse(state);
          alert("warder win");
          setGameState(state);
          setTurn(state.turn);

          const newRole =
            state["prisoner"].id === socket.id ? "prisoner" : "warder";
          setMyRole(newRole);
          setWinCount(state[newRole].win);
        });

        socket.on("gameWinner", (msg) => {
          msg = JSON.parse(msg);
          if (myRole === msg.myRole) {
            alert(msg.winMsg);
          } else {
            alet(msg.loseMsg);
          }
        });
      }
    }, []);

    /* rendering part */
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
        <p>Your Role is : {myRole}</p>
        {header}
        <p>Win Count : {winCount}</p>
        <Turn turn={turn} />
        <div className="game-area">{gameArea}</div>
      </div>
    );
  };
};

export default gameArea;
