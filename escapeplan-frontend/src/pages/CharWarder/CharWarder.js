import React from 'react'

import "./CharWarder.css"

import bubble from "./puff 2.png"
import gru from "./gru 2.png"
import sully from "./sully 2.png"

function CharWarder() {
    return (
        <div className ="charctn">
            <div className="charheader">
                <h1 className="welcome">Choose Your Character : WARDER</h1>
            </div>
            <div className="buttonn">
            <div className="buttons1">
            <img src={bubble} className="bubble"></img>

            <br></br>
            <button className="designbut" name="bubble" id="bubble">
            <p>Bubble</p>
            </button>
            </div>
            
            <div className="buttons2">
            <img src={gru} className="gru" width="165" ></img>

            <br></br>
            <button className="designbut" name="gru" id="gru">
            <p>Gru</p>
            </button>
            </div>

            <div className="buttons3">
            <img src={sully} className="sully" width="315"></img>
            <button className="designbut" name="sully" id="sully">

            </button>

            <br></br>

            <button className="designbut">
            <p>Sully</p>
            </button>
            </div>
            </div>
      </div>
    )
}

export default CharWarder
 






