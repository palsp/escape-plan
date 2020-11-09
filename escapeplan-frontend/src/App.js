import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HowToPlay from "./pages/HowToPlay";
import ServerOrClient from "./pages/ServerOrClient";

import GameArea from "./pages/GameArea/GameArea2";
import StartOrJoin from "./pages/StartOrJoin";
import Song from "./components/Song";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={HomePage}></Route>
          <Route path="/gamearea" exact component={GameArea}></Route>
          <Route path="/song" exact component={Song}></Route>

          <Route path="/startorjoin" exact component={StartOrJoin}></Route>
          <Route path="/howtoplay" exact component={HowToPlay}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
