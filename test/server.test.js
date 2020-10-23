const { expect } = require("chai");
const { gameLoop } = require("../middleware/gameLoop");
describe("Server Test", () => {
  it("pos1 sould be equal to warder pos", () => {
    const res = gameLoop("abc", "warder", 47);
    expect(res.pos1.x).to.be.equal(0);
    expect(res.pos1.y).to.be.equal(0);
  });

  it("oppoRole sould be equal to prisoner", () => {
    const res = gameLoop("abc", "warder", 47);
    expect(res.oppoRole).to.be.equal("prisoner");
  });

  it("should return 0 if  x,y < 0 || x,y > GRID_SIZE", () => {
    const res = gameLoop("abc", "warder", 37);
    expect(res).to.be.equal(0);
  });

  it("should return 1 if prisoner and warder are on the same block", () => {
    // warder = (0,0)
    // prisoner = (0,1)
    const res = gameLoop("abc", "warder", 38);
    expect(res).to.be.equal(1);
    gameLoop("abc", "warder", 40);
  });
});
