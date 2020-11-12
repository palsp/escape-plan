import React from "react";

import "./Characters.css";
import Charater from "./Character/Character";

import bubble from "./puff 2.png";
import Character from "./Character/Character";

// const character = ["sully", "gru", "bubble"];

const Characters = (props) => {
  //   console.log("character", display);
  return (
    <div className="charctn">
      <h1 className="welcome">Choose Your Character</h1>
      <div className="charheader">
        <Character name="mojo" clicked={props.selectChar} />
        <Character name="sully" clicked={props.selectChar} />
        <Character name="gru" clicked={props.selectChar} />
      </div>
    </div>
  );
};

export default Characters;
