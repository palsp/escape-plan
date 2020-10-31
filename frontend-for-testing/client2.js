const io = require("socket.io-client");

const socket = io.connect("http://localhost:3000");

socket.on("init", (msg) => {
  console.log(msg);
});

// socket.emit("createNewGame", "create new game");

// socket.on("newGame", (msg) => {
//   console.log(msg);
// });

socket.emit("joinRoom", "jp06unkgkt7k2y");

socket.on("joinFailed", (msg) => {
  console.log(msg);
});

socket.emit("joinSuccess", (msg) => {
  console.log(JSON.parse(msg));
});
