import React from "react";

import "./Room.css";

const Room = (props) => {
  return (
    <div className="room">
      <div className="room1">
        <p className="pleft">Room No. : {props.room}</p>
        {/* <img src={game} className="game" width="95"></img> */}
        <p className="pright">{props.numPlayer}/2</p>
        <button onClick={() => props.clicked(props.code)} />
      </div>
    </div>
  );
};

export default Room;
