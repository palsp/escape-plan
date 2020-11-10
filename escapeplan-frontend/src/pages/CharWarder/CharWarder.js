import React from 'react'

import "./CharWarder.css"

import bubble from "./puff 2.png"


function CharWarder() {
    return (
        <div className ="charctn">
            <div className="charheader">
                <h1 className="welcome">Choose Your Character</h1>
            </div>
            <div className="buttonn">
            <div className="buttons1">
            <h3>Bubble</h3>

            <br></br>
            <button className="designbut">
            <p>Bubble</p>
            </button>
            </div>
            
            <div className="buttons2">
            <h3>Gru</h3>

            <br></br>
            <button className="designbut">
            <p>Sully</p>
            </button>
            </div>

            <div className="buttons3">

            <h3>Private Room</h3>

            <br></br>

            <button className="designbut">
            <p>Enter Code</p>
            </button>
            </div>
            </div>
      </div>
    )
}

export default CharWarder
 






