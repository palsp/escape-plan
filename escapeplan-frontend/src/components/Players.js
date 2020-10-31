import React, { useState, useEffect } from "react";

function Players() {
  const [x1, setX1] = useState(0);
  const [y1, setY1] = useState(0);

  const [x2, setX2] = useState(0);
  const [y2, setY2] = useState(0);

  const [turn, setTurn] = useState(true);

  const onKeyPressHandler = (e) => {
    console.log("turn ON KEY", turn);
    if (turn) {
      console.log("TRUE1");
      console.log(e);
      if (e.key == "a" && x1 != 0) {
        setX1(x1 - 100);
      }
      if (e.key == "w" && y1 != 400) {
        setY1(y1 + 100);
      }
      if (e.key == "s" && y1 != 0) {
        setY1(y1 - 100);
      }
      if (e.key == "d" && x1 != 400) {
        setX1(x1 + 100);
      }
    } else {
      console.log("FALSE1");
      if (e.key == "a" && x2 != 0) {
        setX2(x2 - 100);
      }
      if (e.key == "w" && y2 != 400) {
        setY2(y2 + 100);
      }
      if (e.key == "s" && y2 != 0) {
        setY2(y2 - 100);
      }
      if (e.key == "d" && x2 != 400) {
        setX2(x2 + 100);
      }
    }
  };

  useEffect(() => {
    //console.log('turn now is '+ turn)
    window.addEventListener("keydown", onKeyPressHandler);
    // console.log('Turn now is ',turn)
    console.log({ x1 });
    console.log({ y1 });

    return () => {
      window.removeEventListener("keydown", onKeyPressHandler);
    };
  }, [x1, y1, turn, x2, y2]);

  return (
    <div>
      {/* <button onClick={toggleTurnHandler}>Toggle</button> */}
      <button onClick={() => setTurn(!turn)}>Toggle turn</button>
      <div className="player1" style={{ left: x1, bottom: y1 }}></div>
      <div className="player2" style={{ left: x2, bottom: y2 }}></div>

      <h2>
        Position 1 X:{x1}, Y:{y1}
      </h2>
      <h2>
        Position 2 X:{x2}, Y:{y2}
      </h2>
    </div>
  );
}

export default Players;
