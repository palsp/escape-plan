import React, { useState, useEffect } from "react";
import Socket from "../../Socket";
import Timer from "../../components/Timer/Timer";
import Tunnel from "../../components/Tunnel/Tunnel";
import Blocks from "../../components/Blocks/Blocks";
import Player from "../../components/Player/Player";
import Turn from "../../components/Turn/Turn";
import Aux from "../../hoc/Aux";
import "./GameArea.css";
import clock from "./clock.png";

const GameArea = ({ history, location }) => {
  const [state, setState] = useState({
    socket: Socket.getClient(),
    gameState: null,
    winCount: 0,
    myRole: location.state.myRole,
    gameStart: false,
    turn: true,
    timer: 10,
    destroyMode: false,
  });

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

    if (
      state.myRole === "warder" &&
      next.x === state.gameState.tunnel.x &&
      next.y === state.gameState.tunnel.y
    ) {
      check = false;
    }
    return check;
  };

  const onKeyPressHandler = (event) => {
    // [turn] true = warder , false = prisoner

    let role = state.turn ? "warder" : "prisoner";
    if (state.myRole !== role) {
      return;
    }
    const validmove = moveValidation(
      event.key,
      state.gameState[role].pos,
      state.gameState.blocks
    );
    if (validmove) {
      let data = {
        keyPress: event.key,
        myRole: state.myRole,
        gameCode: location.state.gameCode,
      };
      state.socket.emit("play", JSON.stringify(data));
      // console.log("data", data);
      return window.removeEventListener("keypress", onKeyPressHandler);
    }
  };

  /*  --------------------------------------------------------------------------------------- */

  // run every rerendering
  useEffect(() => {
    // console.log("[gameArea2.js] add key press");
    window.addEventListener("keypress", onKeyPressHandler);

    return () => {
      window.removeEventListener("keypress", onKeyPressHandler);
    };
  });

  useEffect(() => {});
  // run only once
  useEffect(() => {
    state.socket.on("gameStart", (serverState) => {
      console.log("gameStart");
      const rcvState = JSON.parse(serverState);

      setState((prevState) => {
        return {
          ...prevState,
          gameState: rcvState,
          turn: rcvState.turn,
          gameStart: true,
          winCount: rcvState[location.state.myRole].win,
        };
      });
    });

    state.socket.on("updateTimer", (time) => {
      setState((prevState) => {
        return { ...prevState, timer: time };
      });
    });

    state.socket.on("switchTurn", (newTurn) => {
      console.log("switch", typeof newTurn);
      // console.log(gameState);
      // setTurn(newTurn);
      setState((prevState) => {
        return { ...prevState, turn: newTurn };
      });
    });

    state.socket.on("gameContinue", (serverState) => {
      console.log("gameState before send to server", state.gameState);

      const rcvState = JSON.parse(serverState);
      console.log("game continue", rcvState);
      // setGameState(state);
      // setTurn(turn);

      setState((prevState) => {
        return { ...prevState, gameState: rcvState, turn: rcvState.turn };
      });
    });

    state.socket.on("prisonerWin", (serverState) => {
      const rcvState = JSON.parse(serverState);
      alert("prisoner win");
      // setGameState(state);
      // setTurn(state.turn);

      const newRole =
        rcvState["prisoner"].id === state.socket.id ? "prisoner" : "warder";

      setState((prevState) => {
        return {
          ...prevState,
          myRole: newRole,
          turn: rcvState.turn,
          gameState: rcvState,
          winCount: rcvState[newRole].win,
        };
      });
    });

    state.socket.on("warderWin", (serverState) => {
      const rcvState = JSON.parse(serverState);

      alert("warder win");

      const newRole =
        rcvState["prisoner"].id === state.socket.id ? "prisoner" : "warder";
      setState((prevState) => {
        return {
          ...prevState,
          myRole: newRole,
          turn: rcvState.turn,
          gameState: rcvState,
          winCount: rcvState[newRole].win,
        };
      });
    });

    state.socket.on("gameWinner", (msg) => {
      msg = JSON.parse(msg);
      if (state.myRole === msg.myRole) {
        alert(msg.winMsg);
      } else {
        alert(msg.loseMsg);
      }
      state.socket.disconnect();
      history.push("/");
    });

    state.socket.on("reset", () => {
      alert("reset from server");

      state.socket.disconnect();
      history.push("/");
    });

    console.log(state);
  }, []);

  /* rendering part */
  let header = null;
  if (location.state.gameCode) {
    header = <p> Your gameCode is : {location.state.gameCode}</p>;
  }

  if (state.gameStart) {
    header = (
      <Aux>
        <Timer timer={state.timer} />
        {/* <Turn turn={gameState.turn} /> */}
      </Aux>
    );
  }
  let infoGame = null;
  let gameArea = null;
  let blocks = null;
  if (state.gameState) {
    if (state.gameState.warder.pos && state.gameState.prisoner.pos) {
      blocks = state.gameState.blocks.map((block) => {
        return <Blocks pos={block} color="black" />;
      });

      infoGame = (
        <div className="content1">
          <img src={clock} className="clock" width="95"></img>
          <h3>Your Role is : {state.myRole}</h3>
          {header}
          <h3>Win Count : {state.winCount}</h3>
          <Turn turn={state.turn} />
        </div>
      );

      gameArea = (
        <Aux>
          <Player pos={state.gameState.warder.pos} color="green" />
          <Player pos={state.gameState.prisoner.pos} color="red" />
          {blocks};
          <Tunnel pos={state.gameState.tunnel} color="blue" />
        </Aux>
      );
    }
  }

  return (
    <div className="playhome">
      <div className="content1">
        <img src={clock} className="clock" width="95"></img>
        <h3>Your Role is : {state.myRole}</h3>
        {header}
        <h3>Win Count : {state.winCount}</h3>
        <Turn turn={state.turn} />
      </div>

      <div className="game-area">{gameArea}</div>
    </div>
  );
};

export default GameArea;
