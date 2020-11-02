import React, { useEffect } from "react";
import opensocket from "socket.io-client";
import "../App.css";

function HomePage({ history }) {
  let socket;
  // const onClickHandler1 = () => {
  //   history.push("/serverorclient");
  // };

  const newGameHandler = () => {
    console.log("[HomePage.js] newGameHandler");
    socket.emit("createNewGame");
  };

  const joinGameHandler = () => {};

  const onClickHandler2 = () => {
    history.push("/howtoplay");
  };

  useEffect(() => {
    socket = opensocket("http://localhost:5000");
    console.log("[Homepage.js] use 1st effect");
  }, []);

  useEffect(() => {
    console.log("[Homepage.js] use 2nd effect");
    socket.on("newGame", (input) => {
      const transformedInput = JSON.parse(input);
      const gameCode = transformedInput.gameCode;
      const myRole = transformedInput.myRole;
      const state = transformedInput.state;
      console.log(gameCode, myRole, state);
    });
  }, []);

  const submitHandler = (e) => {
    console.log(e.target.value);
  };
  return (
    <div className="center">
      <br></br>
      <button
        style={{ width: "500px", height: "300px" }}
        onClick={newGameHandler}
      >
        <h1>Start Game</h1>
      </button>

      <form>
        <label>
          <input type="text" name="gamecode"></input>
        </label>
        <input type="submit" value="Submit" onClick={submitHandler}></input>
      </form>

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
