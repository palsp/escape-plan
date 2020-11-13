import React from "react";
import "./Character.css";

const Character = (props) => (
  <div className="buttonnn">
      <h3>{props.name}</h3>
      <button className="myButton" onClick={() => props.clicked(props.name)}>
        Select
      </button>
    </div>
);

export default Character;
