import React from "react";
import "./Blocks.css";

function Blocks(props) {
  return (
    <div
      className="Block"
      style={{
        left: props.pos.x,
        bottom: props.pos.y,
        backgroundColor: props.color,
      }}
    >
      <img src={props.pic} />
    </div>
  );
}

export default Blocks;
