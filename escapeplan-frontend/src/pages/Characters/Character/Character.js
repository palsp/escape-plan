import React from "react";

const Character = (props) => (
  <div className="buttonn">
    <div className="buttons1">
      <h3>{props.name}</h3>

      <br></br>
      <button className="designbut" onClick={() => props.clicked(props.name)}>
        Select
      </button>
    </div>
  </div>
);

export default Character;
