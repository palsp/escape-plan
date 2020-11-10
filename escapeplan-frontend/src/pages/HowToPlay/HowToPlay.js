import React from "react";
import "../../App.css";
import "./HowToPlay.css"
import warderlogo from "../warderlogo.png"
import prisonerlogo from "../prisonerlogo.png"
import wasd from "../wasd.png"

function HowToPlay({ history }) {
  const onClickHandler = () => {
    history.push("/");
  };

  return (
    <div className="howtohome">

      <button onClick={onClickHandler} className="button">back</button>

      <div className="center">
        <h0>How to play</h0>
        <p>You have only 10 seconds to move the character to one of the adjacent blocks</p>
        <br></br>
        <div className="containerlogo">
        <div className="containerlogo1">
        <img src={warderlogo}></img>
        <img src={prisonerlogo}/>
        </div>
         </div>

        <div className="containerhow">
          <div className="warder">
        <p>Warder needs to catch the prisoner by accessing same block</p>
</div>
<div className="prisoner">
        <p>Prisoner needs to escape the warder by accessing the tunnel</p>
        </div>
</div>
<div className="wasd">
<p>How to move?</p>
<img src={wasd}></img>
      </div>
    </div>
    </div>
  );
}

export default HowToPlay;
