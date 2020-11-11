import React from "react";
import "./Player.css";

const player = props => {
  console.log(props.pos);
  return (
    <div
      className="Player"
      style={{
        left: props.pos.x,
        bottom: props.pos.y,
        backgroundColor: props.color
      }}
    ></div>
  );
};

export default player;
