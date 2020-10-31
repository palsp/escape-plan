import logo from "./logo.svg";
import "./App.css";
import Players from "./components/Players";
import Timer from "./components/Timer";
import { useEffect, useState } from "react";
import opensocket from "socket.io-client";

const App = (props) => {
  let gameState, setGameState;
  let socket;
  useEffect(() => {
    socket = opensocket("http://localhost:3000/");
  }, []);

  useEffect(() => {
    socket.on("gameStart", (msg) => {
      console.log("msg");
    });
  }, []);
  const createGameHandler = () => {
    socket.emit("createNewGame");
  };

  // const joinGameHandler = (gameCode) => {
  //   socket.emit("joinRoom", gameCode);
  // };

  const joinGameHandler = () => {
    console.log("yessss");
  };
  useEffect(() => {
    socket.on("newGame", (input) => {
      const msg = JSON.parse(input);
      console.log(msg);
      // msg = {state : ... , myRole : ....  , gameCode : ..... }
      [gameState, setGameState] = useState(msg);
    });
  });

  return (
    <div className="center">
      <div className="App">
        <button onClick={createGameHandler}>Create New Game </button>
        <form>
          <input id="gameRoom" type="text" />
          <button type="submit" value="Submit" onSubmit={joinGameHandler}>
            Join Room
          </button>
        </form>
      </div>
      <div className="game-area">
        {" "}
        <Players></Players>{" "}
      </div>

      <h3>Timer</h3>
      <Timer></Timer>
    </div>
  );
};

export default App;
