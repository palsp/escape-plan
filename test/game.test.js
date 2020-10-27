const { expect } = require("chai");
const sinon = require("sinon");
const { setGameRoom } = require("../models/game-server");
const GameServer = require("../models/game-server");
const gameController = require("../controller/game");
const socket = require("../socket");

let io;
let client;
describe("Game Controller", () => {
  before(function (done) {
    io = require("socket.io")(3000);
    client = require("socket.io-client").connect("http://localhost:3000");
    done();
  });

  after(function (done) {
    client.disconnect();
    io.close();
    done();
  });
  it("should set gamecode to to auto generate gamecode", () => {
    sinon.stub();
    io.on("connection", (socket) => {
      socket.on("createNewGame", gameController.createGame.bind(this, socket));
    });

    client.emit("createNewGame");
    client.on("newGame", (msg) => {});
  });
});
