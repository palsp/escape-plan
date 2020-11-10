import React, { Component } from "react";
import Socket from "../../Socket";
import Timer from "../../components/Timer/Timer";
import Tunnel from "../../components/Tunnel/Tunnel";
import Blocks from "../../components/Blocks/Blocks";
import Player from "../../components/Player/Player";
import Turn from "../../components/Turn/Turn";
import Aux from "../../hoc/Aux";
import "./GameArea.css";





class GameArea extends Component{

state = {

    socket : Socket.getClient();
    gameState : null,
    winCount : 0,
    myRole : this.props.location.state.myRole,
    isStarting : false,
    turn : false, // start with prisoner
    timer : 10,
}

componentDidMount(){
    window.addEventListener("keypress" ,)


}

moveValidation = (keypress, pos, blocks) => {
    let move;
    switch (keypress) {
      // left
      case "a":
        move = { x: -100, y: 0 };
        break;
      // up
      case "w":
        move = { x: 0, y: 100 };
        break;
      //down
      case "s":
        move = { x: 0, y: -100 };
        break;
      // right
      case "d":
        move = { x: 100, y: 0 };
        break;
      default:
        move = { x: 0, y: 0 };
    }
    let next = { x: pos.x + move.x, y: pos.y + move.y };
    let check = true;
    // out of bound
    if (next.x < 0 || next.y < 0 || next.x >= 500 || next.y >= 500) {
      check = false;
    }
    // block collision
    for (let b of blocks) {
      if (b.x === next.x && b.y === next.y) {
        check = false;
      }
    }
    return check;
  };

  onKeyPressHandler = (event) => {
    // [turn] true = warder , false = prisoner
    let role = turn ? "warder" : "prisoner";
    const validmove = moveValidation(
      event.key,
      gameState[role].pos,
      gameState.blocks
    );
    if (validmove) {
      let data = {
        keyPress: event.key,
        myRole: myRole,
        gameCode: info.gameCode,
      };
      // console.log("data", data);
      socket.emit("validateMove", JSON.stringify(data));

      return window.removeEventListener("keypress", onKeyPressHandler);
    }
  };




}

export default GameArea;