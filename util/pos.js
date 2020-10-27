exports.randomPos = () => {
  const x = Math.floor(Math.random() * 5) * 100;
  const y = Math.floor(Math.random() * 5) * 100;

  return { x: x, y: y };
};

exports.isEqualPos = (pos1, pos2) => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

exports.isInArrayOf = (pos1, Arraypos) => {
  let rv = false;
  for (let p of Arraypos) {
    if (this.isEqualPos(pos1, p)) {
      rv = true;
      break;
    }
  }
  return rv;
};
