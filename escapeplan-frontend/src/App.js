import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import HowToPlay from "./pages/HowToPlay/HowToPlay";
import StartGame from "./pages/StartGame/StartGame";
import GameArea from "./pages/GameArea/GameArea2";
import CharWarder from "./pages/CharWarder/CharWarder";
import CharPrisoner from "./pages/CharPrisoner/CharPrisoner";
import Theme from "./pages/Theme/Theme";
import PublicRoom from "./pages/PublicRoom/PublicRoom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={HomePage}></Route>
          <Route path="/startgame" exact component= {StartGame}></Route>
          <Route path="/gamearea" exact component={GameArea}></Route>
          <Route path="/charwarder" exact component={CharWarder}></Route>
          <Route path="/charprisoner" exact component={CharPrisoner}></Route>
          <Route path="/theme" exact component={Theme}></Route>
          <Route path="/publicroom" exact component={PublicRoom}></Route>
          


        
          <Route path="/howtoplay" exact component={HowToPlay}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
