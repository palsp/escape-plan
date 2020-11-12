import React from "react";

import "./Characters.css";

import bubble from "./puff 2.png";

import Character from "./Character/Character";

const Characters = (props) => {
  return (
    <div className="charctn">
      <div className="charheader">
        <h1 className="welcome">Choose Your Character</h1>
      </div>
      <Character name="sully" clicked={props.selectedChar} />
      <Character name="boo" clicked={props.selectedChar} />
      <Character name="mojo" clicked={props.selectedChar} />
    </div>
  );
};

export default Characters;
