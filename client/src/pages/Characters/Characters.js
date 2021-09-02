import React from "react";

import "./Characters.css";
import Character from "./Character/Character";

import Sully from "../../assets/sully.png";
import Mojo from "../../assets/mojojo.png";
import Gru from "../../assets/gru.png";

const Characters = (props) => {
  return (
    <div className="new-ctn">
      <div className="charheader">
        <h1 className="welcome">Choose Your Character</h1>
      </div>
      <div className="charctn">
        <Character name="sully" img={Sully} clicked={props.selectedChar} />
        <Character name="gru" img={Gru} clicked={props.selectedChar} />
        <Character name="mojo" img={Mojo} clicked={props.selectedChar} />
      </div>
    </div>
  );
};

export default Characters;
