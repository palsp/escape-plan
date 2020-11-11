import React, { useState, useEffect } from "react";

import "./StartGame.css";

import host from "./host.png";
import publicpic from "./public.png";
import privatepic from "./private.png";

function StartGame() {
  const [inputGameCode, setInputGameCode] = useState("");
  const onTextChange = e => {
    setInputGameCode(e.target.value);
  };
  return (
    <div className="startctn">
      <div className="enter">
        <h1 className="welcome">Enter Your Name</h1>
        <br></br>

        <input type="text" name="playername"></input>
      </div>
      <div className="buttonn">
        <div className="buttons1">
          <h3>Host</h3>
          <img src={host} className="host" width="95"></img>
          <br></br>
          <button className="designbut">
            <p>Create Game</p>
          </button>
        </div>

        <div className="buttons2">
          <h3>Public Room</h3>
          <img src={publicpic} className="host" width="95"></img>
          <br></br>
          <button className="designbut">
            <p>Find Game</p>
          </button>
        </div>

        <div className="buttons3">
          <h3>Private Room</h3>
          <img src={privatepic} className="host" width="95"></img>
          <br></br>

          <input onChange={e => onTextChange(e)}></input>
          <button className="designbut">
            <p>Enter Code</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartGame;
