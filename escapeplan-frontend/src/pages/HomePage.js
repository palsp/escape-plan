import React, { useEffect, useState } from "react";
import opensocket from "socket.io-client";
import "../App.css";

function HomePage({ history }) {
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
    history.push("/serverorclient");
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

  const onClickHandler2 = () => {
    history.push("/howtoplay");
  };
  useEffect(() => {
    setSocket(opensocket("http://localhost:5000"));
  }, []);
  useEffect(() => {
    opensocket("http://localhost:5000");
  }, []);

  useEffect(() => {
    // console.log("use effect 1 ", socket);
    if (socket) {
      console.log("here");
      socket.on("newGame", (input) => {
        const transformedInput = JSON.parse(input);
        const gameCode = transformedInput.gameCode;
        const myRole = transformedInput.myRole;
        const state = transformedInput.state;
        console.log(gameCode, myRole, state);
        // go to game area
      });
      socket.on("joinSuccess", (input) => {
        const tramsformedInput = JSON.parse(input);
        console.log(tramsformedInput);
        history.push("/serverorclient");
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
        onClick={onClickHandler2}
      >
        <h1>How to play</h1>
      </button>
    </div>
  );
}

export default HomePage;
