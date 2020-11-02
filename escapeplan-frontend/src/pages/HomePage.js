
import React, { useState, useEffect, useContext } from "react";

import { use } from "chai";
import opensocket from "socket.io-client";
import "../App.css";
import GameArea from "./GameArea";
import HowToPlay from "./HowToPlay";
import { Link } from "react-router-dom";

export const UserContext = React.createContext();

function HomePage({ history }) {

  const [transformedInput, setTransformedInput] = useState();
  const [gameCode, setGameCode] = useState();
  const [myRole, setMyRole] = useState();
  const [gameState, setGameState] = useState();
  // const onClickHandler1 = () => {
  //   history.push("/serverorclient");
  // };
  const [socket, setSocket] = useState(null);
  const initialFormData = Object.freeze({
    gameCode: "",
  });

  const [formData, updateFormData] = useState(initialFormData);

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

  const inputHandler = (event) => {
    updateFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const joinGameHandler = (event) => {
    event.preventDefault();
    //console.log(formData.gameCode);∫
    const gameCode = formData.gameCode;
    socket.emit("joinRoom", gameCode);
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
    setSocket(opensocket("http://localhost:5000"));
  }, []);


  

  useEffect(() => {
    // console.log("use effect 1 ", socket);
    if (socket) {
      console.log("here");
      socket.on("newGame", (input) => {
         const transformedInput = JSON.parse(input);
      setTransformedInput(transformedInput);

      const gameCode = transformedInput.gameCode;
      setGameCode(gameCode);

      const myRole = transformedInput.myRole;
      setMyRole(myRole);

      const gameState = transformedInput.state;
      setGameState(gameState);
        // go to game area
      });
    
      socket.on("joinSuccess", (input) => {
        const tramsformedInput = JSON.parse(input);
        console.log(tramsformedInput);
      });
    }
  });

  // const submitHandler = (e) => {
  //   console.log(e.target.value);
  // };
  return (
    <div className="center">
      <br></br>
      <button
        style={{ width: "500px", height: "300px" }}
        onClick={newGameHandler}
      >
        <h1>Start Game</h1>
      </button>



      <label>
        <input type="text" name="gameCode" onChange={inputHandler}></input>
      </label>
      <button onClick={joinGameHandler}>Submit</button>


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
