const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../config/auth");
const users = new Set();

function capitalizeFirstLetter([first = "", ...rest]) {
  return [first.toUpperCase(), ...rest].join("");
}

router.get("/", (req, res) => {
  if (req.session.isAuthenticated) {
    let user = "" + req.session.username;
    let lettersuser = user.charAt(0);
    res.render("index", {
      user: lettersuser.toUpperCase(),
      fullusername: capitalizeFirstLetter(user),
    });
  } else {
    res.render("index", {
      user: null,
    });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/chat", ensureAuth, (req, res) => {
  res.render("chat", {
    user: req.session.username,
  });
  req.io.once("connection", (socket) => {
    const User = {
      username: req.session.username,
    };
    users.add(User);
    console.log(Array.from(users));
    req.io.emit("users-list", Array.from(users));
    socket.once("disconnect", () => {
      users.delete(User);
      req.io.emit("users-list", Array.from(users));
    });
    socket.on("msg", (socket) => {
      req.io.emit("msg", socket, req.session.username);
    });
  });
});

router.get("/dashboard", ensureAuth, (req, res) => {
  res.render("dashboard", {
    user: req.session.username,
    email: req.session.email,
    password: req.session.password,
  });
});

module.exports = router;
