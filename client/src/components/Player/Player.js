import React from "react";
import "./Player.css";

// prisoner character
// import boo from "../../pages/images/boo.png";
// import minion from "../../pages/images/minion.png";
// import mojo from "../../pages/images/mojo.png";

// //warder character
// import sully from "../../pages/images/sully.png";
// import gru from "../../pages/images/gru.png";
// import puff from "../../pages/images/puff.png";

// import boo from "../.png";
const player = (props) => {
  return (
    <div
      className="Player"
      style={{
        left: props.pos.x,
        bottom: props.pos.y,
      }}
    >
      <img src={props.pic} />
    </div>
  );
};

export default player;
