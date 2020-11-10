import React from 'react'

import "./PublicRoom.css"

import game from "./game.png"


function PublicRoom() {
    return (
        <div className ="publicctn">
            <div className="enter">
                <h1 className="welcome">Public Room</h1>
            </div>
            <div className="room">
           <div className="room1">
               <p className="pleft">Room1</p>
               <img src={game} className="game" width="95" ></img>
               <p className="pright">0/1</p>
           </div>

           <div className="room1">
               <p className="pleft">Room2</p>
               <img src={game} className="game" width="95" ></img>
               <p className="pright">0/2</p>
           </div>

           <div className="room1">
               <p className="pleft">Room3</p>
               <img src={game} className="game" width="95" ></img>
               <p className="pright">1/1</p>
           </div>
           </div>
      </div>
    )
}

export default PublicRoom
 