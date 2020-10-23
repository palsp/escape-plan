// const mongoose = require('mongoose');
// const Schema  = mongoose.Schema;

// const gameStateSchema = new Schema({
//       gameCode: String,
//       prisoner : {

//       },
//       warder: {

//       },
//       winPos: {

//       },
//       blockPos: [{

//       }]

// })

class GameState {
  constructor() {
    this.prinsoer = {
      id: "",
      pos: {
        x: 0,
        y: 0,
      },
    };
    this.warder = {
      id: "",
      pos: {
        x: 0,
        y: 0,
      },
    };
    this.winPos = {
      x: 0,
      y: 0,
    };
    this.blockPos = [{}];
  }
  getPrisoner() {
    return this.prisoner;
  }
  getWarder() {
    return this.warder;
  }
  getWinPos() {
    return this.winPos;
  }
  getblockPos() {
    return this.blockPos;
  }

  static creategameState() {
    // random prinsonerpos, warderpos, winblock
  }
}

module.exports = GameState;
