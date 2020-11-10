import React from 'react'

import "./Theme\.css"



function Theme() {
    return (
        <div className ="charctn">
            <div className="charheader">
                <h1 className="welcome">Choose Your Theme</h1>
            </div>
            <div className="buttonn">
            <div className="buttons1">
           

            <br></br>
            <button className="designbut" name="mojo" id="mojo">
            <p>Mojo</p>
            </button>
            </div>
            
            <div className="buttons2">
        

            <br></br>
            <button className="designbut" name="minion" id="minion">
            <p>Minion</p>
            </button>
            </div>

            <div className="buttons3">


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

export default Theme


