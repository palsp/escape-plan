import React from "react";

import "./PublicRoom.css";
import Room from "./Room/Room";

import game from "./game.png";

function PublicRoom(props) {
  let rooms = props.rooms.map((room, index) => {
    return (
      <Room 
        key={index}
        room={index + 1}
        code={room.code}
        numPlayer={room.numClients}
        clicked={props.join}
      />
    );
  });
  console.log("in public room", props.rooms);

  return (
    <div className="publicctn">
      {/* <div> */}
      <div className="enter">
        <h1 className="welcome">Public Room</h1>
      </div>
      {rooms}
    </div>
  );
}

export default PublicRoom;
