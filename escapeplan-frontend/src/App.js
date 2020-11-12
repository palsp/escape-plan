import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import HowToPlay from "./pages/HowToPlay/HowToPlay";
import StartGame from "./pages/StartGame/StartGame";
import GameArea from "./pages/GameArea/GameArea";
import Invite from "./components/Invite/Invite";

import WaitingArea from "./components/WaitingArea/WaitingArea";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={HomePage}></Route>
          <Route path="/startgame" exact component={StartGame}></Route>
          <Route path="/gamearea" exact component={GameArea}></Route>
          {/* <Route path="/song" exact component={Song}></Route> */}
          <Route path="/wait" exact component={WaitingArea} />

          <Route path="/invite" exact component={Invite}></Route>
          {/* <Route path="/timer" exact component={Timer2}></Route> */}

          <Route path="/howtoplay" exact component={HowToPlay}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
