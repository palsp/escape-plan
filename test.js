// if (Validation.isInArrayOf(newPos, gameState.blocks)) {
//     gameState.blocks = gameState.blocks.filter((block) => {
//       return block.x !== newPos.x && block.y !== newPos.y;
//     });
//     return gameState;
//   }

const isInArrayOf = (pos1, Arraypos) => {
  let rv = false;
  for (let p of Arraypos) {
    if (p.x === pos1.x && p.y === pos1.y) {
      rv = true;
      break;
    }
  }
  return rv;
};

let blocks = [
  { x: 1, y: 1 },
  { x: 2, y: 2 },
  { x: 1, y: 2 },
  { x: 1, y: 3 },
  { x: 2, y: 3 },
];

const pos = { x: 1, y: 1 };

blocks = blocks.filter((block) => {
  return block.x !== pos.x && pos.y !== pos.y;
});

console.log(blocks);
