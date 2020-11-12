import React from "react";

import "./Room.css";

const Room = (props) => {
  return (
    <div className="room">
      <div className="room1">
        <p className="pleft">Room No.{props.room} : <span> {props.numPlayer}/2</span></p>
        {/* <img src={game} className="game" width="95"></img> */}
        <button className="myButton2" onClick={() => props.clicked(props.code)} > <p>Join </p></button>
      </div>
    </div>
  );
};

export default Room;
