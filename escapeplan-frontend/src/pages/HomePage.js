import React from "react";
import "../App.css";

function HomePage({ history }) {
  const onClickHandler1 = () => {
    history.push("/serverorclient");
  };
  const onClickHandler2 = () => {
    history.push("/howtoplay");
  };

  return (
    <div className="center">
      <br></br>
      <button
        style={{ width: "500px", height: "300px" }}
        onClick={onClickHandler1}
      >
        <h1>Start Game</h1>
      </button>
      <br></br>
      <button
        style={{ width: "500px", height: "300px" }}
        onClick={onClickHandler2}
      >
        <h1>How to play</h1>
      </button>
    </div>
  );
}

export default HomePage;
