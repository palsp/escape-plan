import React from "react";
import "./StartOrJoin.css";

function StartOrJoin({ history }) {
  const backButtonHandler = () => {
    history.push("/");
  };
  const startGameHandler = () => {
    history.push("/gamearea");
  };

  return (
    <div>
      <button
        style={{ width: "100px", height: "50px" }}
        onClick={backButtonHandler}
      >
        <h2>back</h2>
      </button>
      <div>
        <button onClick={startGameHandler}>Start game</button>
      </div>
      <div>
        <button onClick={startGameHandler}>Join game</button>
      </div>
    </div>
  );
}

export default StartOrJoin;
