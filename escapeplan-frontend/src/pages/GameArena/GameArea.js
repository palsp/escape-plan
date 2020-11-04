import React, { useState, useEffect } from "react";
import Socket from "../../Socket";
import "../../App.css";

function GameArea({ history }) {
  //--------Timer---------

  //const [socket, setSocket] = useState(Socket.getClient());
  console.log(Socket.getClient());
  const [turn, setTurn] = useState(true);
  const [timer, setTimer] = useState(10.0);

  const checkTime = () => {
    if (timer == 0) {
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

  const [x1, setX1] = useState(0);
  const [y1, setY1] = useState(0);

  const [x2, setX2] = useState(0);
  const [y2, setY2] = useState(0);

  const randomPosition = () => {
    let x1 = Math.floor(Math.random() * 5) * 100;
    let y1 = Math.floor(Math.random() * 5) * 100;

    let x2 = Math.floor(Math.random() * 5) * 100;
    let y2 = Math.floor(Math.random() * 5) * 100;

    if (x1 == x2 && y1 == y2) {
      randomPosition();
    } else {
      setX1(x1);
      setY1(y1);

      setX2(x2);
      setY2(y2);
    }
  };

  const onKeyPressHandler = (e) => {
    if (turn && timer > 0) {
      if (e.key === "a" && x1 !== 0) {
        setX1(x1 - 100);
        setTurn(!turn);
        setTimer(10);
      }
      if (e.key === "w" && y1 !== 400) {
        setY1(y1 + 100);
        setTurn(!turn);
        setTimer(10);
      }
      if (e.key === "s" && y1 !== 0) {
        setY1(y1 - 100);
        setTurn(!turn);
        setTimer(10);
      }
      if (e.key === "d" && x1 !== 400) {
        setX1(x1 + 100);
        setTurn(!turn);
        setTimer(10);
      }
    }
    if (!turn && timer > 0) {
      if (e.key === "a" && x2 !== 0) {
        setX2(x2 - 100);
        setTurn(!turn);
        setTimer(10);
      }
      if (e.key === "w" && y2 !== 400) {
        setY2(y2 + 100);
        setTurn(!turn);
        setTimer(10);
      }
      if (e.key === "s" && y2 !== 0) {
        setY2(y2 - 100);
        setTurn(!turn);
        setTimer(10);
      }
      if (e.key === "d" && x2 !== 400) {
        setX2(x2 + 100);
        setTurn(!turn);
        setTimer(10);
      }
    }
  };

  useEffect(() => {
    randomPosition();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyPressHandler);

    return () => {
      window.removeEventListener("keydown", onKeyPressHandler);
    };
  }, [x1, y1, turn, x2, y2]);

  useEffect();
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
              <span style={{ color: "green" }}>P1</span>
            ) : (
              <span style={{ color: "red" }}>P2</span>
            )}
          </span>
        </h2>
        <div className="game-area">
          <div className="player1" style={{ left: x1, bottom: y1 }}></div>
          <div className="player2" style={{ left: x2, bottom: y2 }}></div>
        </div>
        <h2>
          Position 1 X:{x1}, Y:{y1}
        </h2>
        <h2>
          Position 2 X:{x2}, Y:{y2}
        </h2>
      </div>
    </div>
  );
}

export default GameArea;
