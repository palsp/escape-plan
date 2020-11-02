import React, { useState, useEffect, useContext } from "react";
import opensocket from "socket.io-client";
import "../App.css";
import GameArea from "./GameArea";
import HowToPlay from "./HowToPlay";
import { Link } from "react-router-dom";

export const UserContext = React.createContext();

function HomePage({ history }) {
  let socket;
  const [transformedInput, setTransformedInput] = useState();
  const [gameCode, setGameCode] = useState();
  const [myRole, setMyRole] = useState();
  const [gameState, setGameState] = useState();

  const newGameHandler = () => {
    console.log("[HomePage.js] newGameHandler");
    socket.emit("createNewGame");

    history.push("/gamearea", {
      transformedInput: transformedInput,
      gameCode: gameCode,
      myRole: myRole,
      gameState: gameState
    });
  };

  const howToPlayHandler = () => {
    history.push("/howtoplay", {
      transformedInput: transformedInput,
      gameCode: gameCode,
      myRole: myRole,
      gameState: gameState
    });
  };

  useEffect(() => {
    socket = opensocket("http://localhost:5000");
    console.log("[Homepage.js] use 1st effect");
  }, []);

  useEffect(() => {
    console.log("[Homepage.js] use 2nd effect");
    socket.on("newGame", input => {
      const transformedInput = JSON.parse(input);
      setTransformedInput(transformedInput);

      const gameCode = transformedInput.gameCode;
      setGameCode(gameCode);

      const myRole = transformedInput.myRole;
      setMyRole(myRole);

      const gameState = transformedInput.state;
      setGameState(gameState);
      // console.log(gameCode, myRole, gameState);
    });
  }, []);

  return (
    <div className="center">
      <br></br>
      <button
        style={{ width: "500px", height: "300px" }}
        onClick={newGameHandler}
      >
        <h1>Start Game</h1>
      </button>

      <br></br>
      <button
        style={{ width: "500px", height: "300px" }}
        onClick={howToPlayHandler}
      >
        <h1>How to play</h1>
      </button>
    </div>
  );
}

export default HomePage;
