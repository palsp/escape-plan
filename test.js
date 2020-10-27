const GameState = require("./models/game-state");

const res = GameState.createGameState(123);

console.log(res);

setInterval(() => {
  const x = Math.floor(Math.random() * 5) * 100;
  console.log(x);
}, 100);

let x = [
  { x: 1, y: 1 },
  { x: 2, y: 2 },
];

console.log(Object.is({ x: 1, y: 1 }, x[1]));
console.log(Object.is({ x: 2, y: 2 }, x[1]));

console.log(x

const isEqualPos = (pos1, pos2) => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

const isInArrayOf = (pos1, Arraypos) => {
  let rv = false;
  for (let p of Arraypos) {
    if (isEqualPos(pos1, p)) {
      rv = true;
      break;
    }
  }
  return rv;
};

let x = [
  { x: 1, y: 1 },
  { x: 2, y: 2 },
];

console.log(isInArrayOf({ x: 1, y: 2 }, x));
