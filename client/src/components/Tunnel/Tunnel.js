import React from "react";
import "./Tunnel.css";

function Tunnel(props) {
  return (
    <div
      className="Tunnel"
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

export default Tunnel;
