import React, { useEffect, useState } from "react";

import "./StartGame.css";

import host from "./host.png";
import publicpic from "./public.png";
import privatepic from "./private.png";
import Socket from "../../Socket";
import PublicRoom from "../../components/PublicRoom/PublicRoom";

function StartGame({ history }) {
  const [username, setUserName] = useState();
  const [gameCode, setGameCode] = useState();
  const [socket, setSocket] = useState(Socket.getClient());
  const [publicRoom, setPublicRoom] = useState([]);
  const [showAllRoom, setShowAllRoom] = useState(false);
  const newGameHandler = () => {
    socket.emit("createNewGame");
  };

  const inputNameHandler = (event) => {
    setUserName(event.target.value);
  };

  const inputGameCodeHandler = (event) => {
    setGameCode(event.target.value);
  };
  const joinWithCodeHandler = (event) => {
    event.preventDefault();
    socket.emit("joinRoom", gameCode);
  };

  const showPublicRoomHandler = () => {
    setShowAllRoom(true);
  };

  useEffect(() => {
    setShowAllRoom(false);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("newGame", (input) => {
        const transformedInput = JSON.parse(input);

        const gameCode = transformedInput.gameCode;

        const myRole = transformedInput.myRole;

        const gameState = transformedInput.state;

        // go to game area // user 1
        history.push("/gamearea", {
          //   transformedInput: transformedInput,
          myRole: myRole,
          gameState: gameState,
          gameCode: gameCode,
        });
      });

      socket.on("joinSuccess", (input) => {
        const transformedInput = JSON.parse(input);
        const myRole = transformedInput.myRole;
        const gameState = transformedInput.state;
        const gameCode = transformedInput.gameCode;

        // go to game area // user 2
        socket.emit("ready", gameCode);
        history.push("/gamearea", {
          //   transformedInput: transformedInput,
          myRole: myRole,
          gameState: gameState,
          gameCode: gameCode,
        });
      });

      socket.on("getAllRoom", (input) => {
        setPublicRoom(JSON.parse(input).rooms);
      });
    }
  }, [socket]);

  let display;
  if (showAllRoom) {
    display = <PublicRoom />;
  }
  return (
    <div className="startctn">
      <div className="enter">
        <h1 className="welcome">Enter Your Name</h1>
        <br></br>

        <input
          type="text"
          name="playername"
          onChange={inputNameHandler}
          value={username}
        ></input>
      </div>
      <div className="buttonn">
        <div className="buttons1">
          <h3>Host</h3>
          <img src={host} className="host" width="95"></img>
          <br></br>
          <button className="designbut" onClick={newGameHandler}>
            <p>Create Game</p>
          </button>
        </div>

        <div className="buttons2">
          <h3>Public Room</h3>
          <img src={publicpic} className="host" width="95"></img>
          <br></br>
          <button className="designbut" onClick={showPublicRoomHandler}>
            Find Game
          </button>
        </div>

        <div className="buttons3">
          <h3>Private Room</h3>
          <img src={privatepic} className="host" width="95"></img>
          <br></br>

          {/* <button className="designbut">
            <p>Enter Code</p>
          </button> */}
          <label>
            <input
              type="text"
              name="gameCode"
              onChange={inputGameCodeHandler}
              className="inputcode"
            />
            <button onClick={joinWithCodeHandler}>Join Room</button>
          </label>
        </div>
      </div>
      {display}
    </div>
  );
}

export default StartGame;
