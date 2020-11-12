import React from "react";
import "./Character.css";

const Character = (props) => (
  <div className="buttonnn">
    <div className="buttons1">
      <h3>{props.name}</h3>
      <button className="design" onClick={() => props.clicked(props.name)}>
        Select
      </button>
    </div>
  </div>
);

export default Character;
