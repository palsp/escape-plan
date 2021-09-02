// const { expect } = require("chai");
// const { gameLoop } = require("../middleware/gameLoop");
// const sinon = require("sinon");
// const GameServer = require("../models/game-server");
// describe("Server Test", () => {
//   beforeEach(function (done) {
//     sinon.stub(GameServer, "getAllRoom");
//     GameServer.getAllRoom.returns({
//       123: "abc",
//       456: "abc",
//     });
//     done();
//   });
//   afterEach(function (done) {
//     GameServer.getAllRoom.restore();
//     GameServer.getAllState.restore();
//     done();
//   });
//   it("pos1 sould be equal to warder pos", () => {
//     sinon.stub(GameServer, "getAllState");
//     GameServer.getAllState.returns({
//       abc: {
//         warder: {
//           id: "123",
//           pos: {
//             x: 0,
//             y: 0,
//           },
//         },
//         prisoner: {
//           id: "456",
//           pos: {
//             x: 0,
//             y: 1,
//           },
//         },
//         tunnel: {
//           x: 50,
//           y: 50,
//         },
//         blocks: [
//           { x: 5, y: 5 },
//           { x: 15, y: 15 },
//           { x: 20, y: 20 },
//           { x: 25, y: 25 },
//           { x: 30, y: 30 },
//         ],
//       },
//     });
//     const res = gameLoop("abc", "warder", 47);
//     expect(res.pos1.x).to.be.equal(0);
//     expect(res.pos1.y).to.be.equal(0);
//   });

//   it("oppoRole should be equal to prisoner", () => {
//     const res = gameLoop("abc", "warder", 47);
//     expect(res.oppoRole).to.be.equal("prisoner");
//   });

//   it("should return 0 if  x,y < 0 || x,y > GRID_SIZE", () => {
//     const res = gameLoop("abc", "warder", 37);
//     expect(res).to.be.equal(0);
//   });

//   it("should return 1 if prisoner and warder are on the same block", () => {
//     // warder = (0,0)
//     // prisoner = (0,1)
//     const res = gameLoop("abc", "warder", 38);
//     expect(res).to.be.equal(1);
//     gameLoop("abc", "warder", 40);
//   });
// });
