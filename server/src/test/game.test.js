// const { expect } = require("chai");
// const sinon = require("sinon");
// const { setGameRoom } = require("../models/game-server");
// const GameServer = require("../models/game-server");
// const gameController = require("../controller/game");
// const socket = require("../socket");
// // const { getIO } = require("../socket");

// let io;
// let client;
// describe("Game Controller - create new game", () => {
//   before(function (done) {
//     io = require("socket.io")(3000);
//     client = require("socket.io-client").connect("http://localhost:3000");
//     done();
//   });

//   after(function (done) {
//     client.disconnect();
//     io.close();
//     done();
//   });
//   it("should set gamecode to to auto generate gamecode", () => {
//     sinon.stub();
//     io.on("connection", (socket) => {
//       socket.on("createNewGame", gameController.createGame.bind(this, socket));
//     });

//     client.emit("createNewGame");
//     client.on("newGame", (msg) => {});
//   });
// });

// describe("game controller - join game", () => {
//   before(function (done) {
//     io = require("socket.io")(3000);
//     client = require("socket.io-client").connect("http://localhost:3000");
//     done();
//   });
//   afterEach(function (done) {
//     client.disconnect();
//     io.close();
//     done();
//   });

//   it('it should return "Room doesnt exist" if there is no client', () => {});

//   it("it should accept user if ther is only one user in the room", () => {
//     io.on("connection", (socket) => {
//       socket.on("test", () => {
//         socket.join("12345");
//       });

//       socket.on("joinRoom", gameController.joinGame.bind(this, socket));
//     });

//     sinon.stub(socket, "getIO");
//     socket.getIO.returns(io);

//     client.emit("test");

//     client2 = require("socket.io-client").connect("http://localhost:3000");
//     client2.emit("joinRoom", "12345");
//     client2.on("joinSuccess", (msg) => {
//       expect(msg).to.be.equal(2);
//       socket.getIO.restore();
//     });
//   });

//   // it("it sholud reject user if there are more than two user", () => {
//   //   io.on("connection", (socket) => {
//   //     socket.on("test", () => {
//   //       socket.join("12345");
//   //     });
//   //     //socket.on("joinRoom", gameController.joinGame.bind(this, socket));
//   //   });
//   //   sinon.stub(socket, "getIO");
//   //   socket.getIO.returns(io);
//   //   socket.getIO.restore();
//   // });
// });
