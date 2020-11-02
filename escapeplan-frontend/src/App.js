import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HowToPlay from "./pages/HowToPlay";
import ServerOrClient from "./pages/ServerOrClient";
import GameArea from "./pages/GameArena/GameArea";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={HomePage}></Route>
          {/* <Route path="/" exact render={props => <HomePage />}></Route> */}
          <Route path="/gamearea" exact component={GameArea}></Route>
          <Route
            path="/serverorclient"
            exact
            component={ServerOrClient}
          ></Route>
          <Route path="/howtoplay" exact component={HowToPlay}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
