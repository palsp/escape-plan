import React, { useState, useEffect } from "react";
import Socket from "../../Socket";
import Timer from "../../components/Timer/Timer";
import Tunnel from "../../components/Tunnel/Tunnel";
import Blocks from "../../components/Blocks/Blocks";
import Player from "../../components/Player/Player";
import Turn from "../../components/Turn/Turn";
import Aux from "../../hoc/Aux";
import WaitingArea from "../../components/WaitingArea/WaitingArea";
import "./GameArea.css";

import Characters from "../Characters/Characters";
import clock from "./clock.png";

// prisoner pic
import mojo from "../../pages/images/mojojo.png";
import minion from "../../pages/images/minion.png";
import boo from "../../pages/images/boo.png";
import prisoner from "../../pages/images/prisonerlogo.png";

//warder pic

import gru from "../../pages/images/gru.png";
import puff from "../../pages/images/puff.png";
import sully from "../../pages/images/sully.png";
import warder from "../../pages/images/warderlogo.png";

// tunnel pic
import tunnel from "../../pages/images/cave.png";

// block pic
import rock from "../../pages/images/rock.png";

const gameSet = {
  default: { prisonerPic: prisoner, warderPic: warder },
  sully: { prisonerPic: boo, warderPic: sully },
  mojo: { prisonerPic: mojo, warderPic: puff },
  gru: { prisonerPic: minion, warderPic: gru },
};

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
    clientList: [],
  });

  /*  method */

  const moveValidation = (keypress, pos, blocks) => {
    if (keypress === "k") {
      setState((prevState) => {
        return { ...prevState, destroyMode: true };
      });
      return;
    }

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
      if (state.destroyMode) {
        if (b.x === next.x && b.y === next.y) {
          return true;
        }
      } else {
        if (b.x === next.x && b.y === next.y) {
          check = false;
        }
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

      if (state.destroyMode) {
        state.socket.emit("destroyblock", JSON.stringify(data));
        setState((prevState) => {
          return { ...prevState, destroyMode: false };
        });
      } else {
        state.socket.emit("play", JSON.stringify(data));
      }
      // console.log("data", data);
      return window.removeEventListener("keypress", onKeyPressHandler);
    }
  };

  const inviteUserHandler = (name) => {
    console.log("inviteUserFromClient", location.state);
    state.socket.emit("inviteUser", {
      name: name,
      gameCode: location.state.gameCode,
    });
  };

  const selectedCharHandler = (char) => {
    state.socket.emit("selectedChar", char);
  };

  // const acceptInviteHandler = (gameCode) => {
  //   state.socket.emit("acceptInvite", gameCode);
  //   setState((prevState) => {
  //     return { ...prevState, showInviteMessage: false };
  //   });
  // };

  // const rejectInviteHandler = () => {
  //   setState((prevState) => {
  //     return { ...prevState, showInviteMessage: false };
  //   });
  // };

  /*  --------------------------------------------------------------------------------------- */

  // run every rerendering
  useEffect(() => {
    // console.log("[gameArea2.js] add key press");
    window.addEventListener("keypress", onKeyPressHandler);

    return () => {
      window.removeEventListener("keypress", onKeyPressHandler);
    };
  });

  useEffect(() => {
    state.socket.on("userJoin", (user) => {
      const clientList = [...state.clientList];
      clientList.push(user);
      console.log("userJoin", clientList);
      setState((prevState) => {
        return { ...prevState, clientList: clientList };
      });
    });

    state.socket.on("userList", (list) => {
      console.log("userList");
      // console.log("user join", list);
      const clientList = JSON.parse(list).clientList;
      // console.log("here", clientList);
      setState((prevState) => {
        return { ...prevState, clientList: clientList };
      });
    });

    state.socket.on("updateClientList", (user) => {
      let newList = [...state.clientList];
      newList = newList.filter((client) => {
        return client.name !== user.name;
      });
      console.log("newList", newList);
      setState((prevState) => {
        return { ...prevState, clientList: newList };
      });
    });
  }, [state.clientList]);
  // run only once
  useEffect(() => {
    state.socket.emit("requestUserList");
    console.log("use effect 1st", location.state);

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

    state.socket.on("destroyBlock", (serverState) => {
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

    // state.socket.on("gameWinner", (msg) => {
    //   msg = JSON.parse(msg);
    //   if (state.myRole === msg.myRole) {
    //     alert(msg.winMsg);
    //   } else {
    //     alert(msg.loseMsg);
    //   }
    //   state.socket.emit("endgame");
    //   state.socket.disconnect();
    //   history.push("/");
    // });

    state.socket.on("reset", () => {
      alert("reset from server");

      state.socket.disconnect();
      history.push("/");
    });

    console.log(state);
  }, []);

  useEffect(() => {
    state.socket.on("gameWinner", (msg) => {
      msg = JSON.parse(msg);
      if (state.myRole === msg.myRole) {
        alert(msg.winMsg);
      } else {
        alert(msg.loseMsg);
      }
      state.socket.emit("endgame");
      state.socket.disconnect();
      history.push("/");
    });
  }, [state.myRole]);
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
  let gameArea = (
    <Aux>
      <WaitingArea list={state.clientList} invite={inviteUserHandler} />
      <Characters selectedChar={selectedCharHandler} />
    </Aux>
  );
  let blocks = null;

  if (state.gameState) {
    if (state.gameState.warder.pos && state.gameState.prisoner.pos) {
      blocks = state.gameState.blocks.map((block) => {
        return <Blocks pos={block} pic={rock} />;
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
        <div className="game-area">
          <Player
            pos={state.gameState.warder.pos}
            pic={gameSet[state.gameState.selectedChar].prisonerPic}
          />
          <Player
            pos={state.gameState.prisoner.pos}
            pic={gameSet[state.gameState.selectedChar].warderPic}
          />
          {blocks};
          <Tunnel pos={state.gameState.tunnel} pic={tunnel} />
        </div>
      );
    }
  }

  return (
    <div className="playhome">
      {/* {inviteMessage} */}
      <div className="content1">
        <img src={clock} className="clock" width="95"></img>
        <h3>Your Role is : {state.myRole}</h3>
        {header}
        <h3>Win Count : {state.winCount}</h3>
        <Turn turn={state.turn} />
      </div>
      {gameArea}
      {/* <div className="game-area">{gameArea}</div> */}
    </div>
  );
};

export default GameArea;
