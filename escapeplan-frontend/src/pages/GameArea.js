import React, { useState, useEffect } from "react";
import Socket from "../Socket";
import "../App.css";

function GameArea({ history, location }) {
  // --------- Game Information ----------

  const [socket, setSocket] = useState(Socket.getClient());
  // console.log("socket", Socket.getClient());

  const info = location.state;
  const myRole = info.myRole;

  const [posWarder, setPosWarder] = useState([0, 0]);
  const [posPrisoner, setPosPrisoner] = useState([0, 0]);

  //--------Timer---------

  const [turn, setTurn] = useState(true);
  const [timer, setTimer] = useState(10.0);

  const checkTime = () => {
    if (timer === 0) {
      setTurn(!turn);
      setTimer(10);
    }
  };

  const tick = () => {
    setTimer(prevTimer => prevTimer - 1);
  };

  useEffect(() => {
    checkTime();
  });

  useEffect(() => {
    setInterval(tick, 1000);

    return () => {
      clearInterval();
    };
  }, []);

  // -----------------------------------------------------------------------------------------------------------------------------

  // -------- Game Process ------------

  // const randomPosition = () => {
  //   let x1 = Math.floor(Math.random() * 5) * 100;
  //   let y1 = Math.floor(Math.random() * 5) * 100;

  //   let x2 = Math.floor(Math.random() * 5) * 100;
  //   let y2 = Math.floor(Math.random() * 5) * 100;

  //   if (x1 == x2 && y1 == y2) {
  //     randomPosition();
  //   } else {
  //     setX1(x1);
  //     setY1(y1);

  //     setX2(x2);
  //     setY2(y2);
  //   }
  // };

  const [keyPress, setKeyPress] = useState("");

  const onKeyPressHandler = e => {
    // Warder turn
    if (turn && timer > 0) {
      let [x, y] = [posWarder[0], posWarder[1]];

      if (e.key === "a" && x !== 0) {
        setKeyPress(e.key);
        setPosWarder([x - 100, y]);
        setTurn(!turn);
        setTimer(10);
      }
      if (e.key === "w" && y !== 400) {
        setKeyPress(e.key);
        setPosWarder([x, y + 100]);
        setTurn(!turn);
        setTimer(10);
      }
      if (e.key === "s" && y !== 0) {
        setKeyPress(e.key);
        setPosWarder([x, y - 100]);
        setTurn(!turn);
        setTimer(10);
      }
      if (e.key === "d" && x !== 400) {
        setKeyPress(e.key);
        setPosWarder([x + 100, y]);
        setTurn(!turn);
        setTimer(10);
        console.log("check1", keyPress);
      }
    }
    // Prisoner turn
    if (!turn && timer > 0) {
      let [x, y] = [posPrisoner[0], posPrisoner[1]];
      if (e.key === "a" && x !== 0) {
        setKeyPress(e.key);
        setPosPrisoner([x - 100, y]);
        setTurn(!turn);
        setTimer(10);
      }
      if (e.key === "w" && y !== 400) {
        setKeyPress(e.key);
        setPosPrisoner([x, y + 100]);
        setTurn(!turn);
        setTimer(10);
      }
      if (e.key === "s" && y !== 0) {
        setKeyPress(e.key);
        setPosPrisoner([x, y - 100]);
        setTurn(!turn);
        setTimer(10);
      }
      if (e.key === "d" && x !== 400) {
        setKeyPress(e.key);
        console.log("check1", keyPress);
        setPosPrisoner([x + 100, y]);
        setTurn(!turn);
        setTimer(10);
      }
    }
  };

  const positionSet = () => {
    // Role: Warder
    if (myRole === "warder") {
      setPosWarder([info.gameState.warder.pos.x, info.gameState.warder.pos.y]);
      setPosPrisoner([0, 0]);

      // Role: Prisoner
    } else {
      setPosWarder([0, 0]);
      setPosPrisoner([
        info.gameState.prisoner.pos.x,
        info.gameState.prisoner.pos.y
      ]);
    }
  };

  useEffect(() => {
    console.log("info", info);
    console.log("block", info.gameState.blocks);
    console.log("tunnel", info.gameState.tunnel);
    positionSet();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyPressHandler);
    console.log("---------------move---------------");
    console.log("POS WARDER", posWarder);
    console.log("POS PRISONER", posPrisoner);
    console.log("");

    socket.emit("warderMove", keyPress);
    socket.emit("prisonerMove", keyPress);
    setKeyPress("");

    return () => {
      window.removeEventListener("keydown", onKeyPressHandler);
    };
  }, [turn, posWarder, posPrisoner]);

  // -----------------------------------------------------------------------------------------------------------------------------

  const onClickHandler = () => {
    history.push("/");
  };
  // ----------- Rendoring -----------
  return (
    <div>
      <button
        style={{ width: "100px", height: "50px" }}
        onClick={onClickHandler}
      >
        <h2>back</h2>
      </button>
      <div className="center">
        <br></br>
        <br></br>
        Time: <b>{timer}</b>
        <br></br>
        <h2>
          TURN: {[" "]}
          <span>
            {turn ? (
              <span style={{ color: "green" }}>Warder</span>
            ) : (
              <span style={{ color: "red" }}>Prisoner</span>
            )}
          </span>
        </h2>
        <div className="game-area">
          <div
            className="player1"
            style={{ left: posWarder[0], bottom: posWarder[1] }}
          ></div>
          <div
            className="player2"
            style={{ left: posPrisoner[0], bottom: posPrisoner[1] }}
          ></div>
        </div>
        <h2>
          Position Warder X:{posWarder[0]}, Y:{posWarder[1]}
        </h2>
        <h2>
          Position Prisoner X:{posPrisoner[0]}, Y:{posPrisoner[1]}
        </h2>
      </div>
    </div>
  );
}

export default GameArea;
