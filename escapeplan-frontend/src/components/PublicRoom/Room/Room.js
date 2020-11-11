import React from "react";

import "./Room.css";

const Room = (props) => {
  return (
    <div className="room">
      <div className="room1">
        <p className="pleft">Room1</p>
        {/* <img src={game} className="game" width="95"></img> */}
        <p className="pright">0/2</p>
      </div>
    </div>
  );
};

export default Room;
