const { expect } = require("chai");
const sinon = require("sinon");
const GameServer , {setGameRoom} = require("../models/server");
const roomController = require("../controller/room");
const socket = require("../socket");
// const { getIO } = require("../socket");

let io;
let client;

describe("Game Controller - create new game", () => {
  before(function (done) {
    io = require("socket.io")(3000);
    sinon.stub(socket, "getIO");
    socket.getIO.returns(io);
    io.on("connection", (socket) => {
      socket.on("createNewGame", gameController.joinGame.bind(this, socket));

      done();
    });
    client = require("socket.io-client").connect("http://localhost:3000");
  });

  after(function (done) {
    client.disconnect();
    io.close();
    socket.getIO.restore();
    done();
  });

  it("should set gamecode to to auto generate gamecode", (done) => {
    client.emit("createNewGame");
    client.once("newGame", (msg) => {
      console.log(msg);
      done();
    });
  });
});
