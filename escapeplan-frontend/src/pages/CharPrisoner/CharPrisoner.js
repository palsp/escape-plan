import React from 'react'

import "./CharPrisoner\.css"

import mojo from "./mojo 2.png"
import boo from "./boo 2.png"
import minion from "./minion 2.png"

function CharPrisoner() {
    return (
        <div className ="charctn">
            <div className="charheader">
                <h1 className="welcome">Choose Your Character : PRISONER</h1>
            </div>
            <div className="buttonn">
            <div className="buttons1">
            <img src={mojo} className="mojo" width="350"></img>

            <br></br>
            <button className="designbut" name="mojo" id="mojo">
            <p>Mojo</p>
            </button>
            </div>
            
            <div className="buttons2">
            <img src={minion} className="mojo" width="200"></img>

            <br></br>
            <button className="designbut" name="minion" id="minion">
            <p>Minion</p>
            </button>
            </div>

            <div className="buttons3">
            <img src={boo} className="boo" width="160"></img>


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

export default CharPrisoner
 


