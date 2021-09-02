const GameServer = require("../models/server");

const admins = [{ usename: "pal", password: "12345" }];

exports.login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  const adminIndex = admins.findIndex(
    (admin) => admin.username === username && admin.password === password
  );
  if (adminIndex > 0) {
    const state = GameServer.getAllState();
    const rooms = Object.keys(state);
    res.render("admin", {
      rooms: rooms,
    });
  } else {
    res.redirect("/");
  }
};

exports.addAdmin = (req, res, next) => {};

exports.getRoom = (req, res, next) => {
  const state = GameServer.getAllState();
  const rooms = Object.keys(state);

  res.render("admin", {
    rooms: rooms,
  });
};
