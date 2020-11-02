import React, { useState, useEffect } from "react";
import opensocket from "socket.io-client";
import "../App.css";

export const UserContext = React.createContext();

function HomePage({ history }) {
  const [socket, setSocket] = useState(null);
  const initialFormData = Object.freeze({
    gameCode: "",
  });

  const [formData, updateFormData] = useState(initialFormData);

  const newGameHandler = () => {
    console.log("[HomePage.js] newGameHandler");
    socket.emit("createNewGame");
  };

  const inputHandler = (event) => {
    updateFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const joinGameHandler = (event) => {
    event.preventDefault();
    const gameCode = formData.gameCode;
    socket.emit("joinRoom", gameCode);
  };

  const howToPlayHandler = () => {
    history.push("/howtoplay");
  };
  useEffect(() => {
    setSocket(opensocket("http://localhost:5000"));
  }, []);

  useEffect(() => {
    if (socket) {
      console.log("here");
      socket.on("newGame", (input) => {
        const transformedInput = JSON.parse(input);

        const gameCode = transformedInput.gameCode;

        const myRole = transformedInput.myRole;

        const gameState = transformedInput.state;

        // go to game area
        history.push("/gamearea", {
          transformedInput: transformedInput,
          gameCode: gameCode,
          myRole: myRole,
          gameState: gameState,
          socketState: socket,
        });
      });

      socket.on("joinSuccess", (input) => {
        const tramsformedInput = JSON.parse(input);
        console.log(tramsformedInput);
      });
    }
  });

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
