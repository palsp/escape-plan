let timer = 10;

module.exports = {
  getTimer: () => {
    return timer;
  },

  setTimer: (time) => {
    timer = time;
    return timer;
  },

  resetTimer: () => {
    timer = 10;
    return timer;
  },
};
