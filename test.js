const state = {
  abc: {
    warder: {
      id: "123",
      pos: {
        x: 0,
        y: 0,
      },
    },
    prisoner: {
      id: "456",
      pos: {
        x: 0,
        y: 1,
      },
    },
    winPos: {
      x: 50,
      y: 50,
    },
    blockPos: [
      { x: 5, y: 5 },
      { x: 15, y: 15 },
      { x: 20, y: 20 },
      { x: 25, y: 25 },
      { x: 30, y: 30 },
    ],
  },
};
const pos1 = { ...state["abc"]["warder"].pos };

pos1.x += 1;

console.log(pos1);
console.log(state["abc"]["warder"].pos);

// const test = { x: 1, y: 2 };

// const test2 = { ...test };
// test2.x += 1;

// console.log(test, test2);
