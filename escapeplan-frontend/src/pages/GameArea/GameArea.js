import React, { useState, useEffect } from "react";
import Socket from "../../Socket";
import Player from "../../components/Player/Player";
import Timer from "../../components/Timer/Timer";
import Turn from "../../components/Turn/Turn";
import "./GameArea.css";

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
    setTimer((prevTimer) => prevTimer - 1);
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

  const [keyPress, setKeyPress] = useState("");

  const onKeyPressHandler = (e) => {
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
        setTurn((prevState) => !prevState);
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
        info.gameState.prisoner.pos.y,
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
        <Timer />
        <br></br>
        <Turn turn={!turn} />
        <h2>
          Position Prisoner X:{posPrisoner[0]}, Y:{posPrisoner[1]}
        </h2>
      </div>
    </div>
  );
}
