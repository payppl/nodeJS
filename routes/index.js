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
router.get("/gamble", ensureAuth, (req, res) => {
  res.render("gamble", {
    user: req.session.username,
  });
  req.io.once("connection", (socket) => {
    const User = {
      username: req.session.username,
    };
    const price = 10;
    let currentprice = 0;
    let person = "";
    req.io.emit("getCurrentItem", price, currentprice, person);
    socket.on("bidOn", (s) => {
      currentprice += price;
      console.log(currentprice)
      person = req.session.username;
      req.io.emit("bidOn", currentprice, person);
    });
  });
});
module.exports = router;
