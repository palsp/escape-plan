import React from "react";
import "../App.css";

function HowToPlay({ history }) {
  const onClickHandler = () => {
    history.push("/");
  };
  return (
    <div>
      <button
        style={{ width: "100px", height: "50px" }}
        onClick={onClickHandler}
      >
        <h2>back</h2>
      </button>

      <div className="center">
        <h1>How to play</h1>
        <b>1. lsafkmjasdl;faf</b>
        <br></br>
        <b>2. lsafkmjasdl;faf</b>
        <br></br>
        <b>3. lsafkmjasdl;faf</b>
        <br></br>
      </div>
    </div>
  );
}

export default HowToPlay;