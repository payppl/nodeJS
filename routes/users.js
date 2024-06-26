const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const passport = require("passport");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "BehsbHFGbwjsbvYBwbu@12",
  database: "baza",
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/login", (request, response) => {
  let username = request.body.username;
  let password = request.body.password;
  let pureUsername = username.replace("/;,.", "");
  let purePassword = password.replace("/;,.", "");
  if (pureUsername && purePassword) {
    connection.query(
      "SELECT * FROM accounts WHERE username = ? AND password = ?",
      [pureUsername, purePassword],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          request.session.username = results[0].username;
          request.session.password = results[0].password;
          request.session.email = results[0].email;
          request.session.isAuthenticated = true;
          response.redirect("/");
        } else {
          request.flash("error_msg", "Incorrect Username or Password");
          response.redirect("/login");
        }
        response.end();
      }
    );
  } else {
    request.flash("error_msg", "Please enter Username and Password!");
    response.redirect("/login");
    response.end();
  }
});
router.post("/register", (request, response) => {

  let pureUsername = request.body.username.replace("/;,", "");
  let purePassword = request.body.password.replace("/;,", "");
  let purePassword2 = request.body.password2.replace("/;","");

  let email = request.body.email;
  let errors = [];
  if (!pureUsername || !email || !purePassword || !purePassword2) {
    errors.push({ msg: "Please fill in all fields" });
  }
  if (pureUsername !== purePassword2) {
    errors.push({ msg: "passwords dont match" });
  }
  if (pureUsername.length <= 6) {
    errors.push({ msg: "password atleast 6 characters" });
  }
  if (errors.length > 0) {
    response.render("register", {
      errors: errors,
    });
  } else {
    connection.query(
      "INSERT INTO accounts(username,password,email) VALUES (?,?,?)",
      [pureUsername, purePassword, email],
      function (error, results, fields) {
        if (error) throw error;
        response.render("login", {
          success_msg: "Register succesfully",
        });
        response.end();
      }
    );
  }
});
router.post("/edit", (request, response) => {
  let username = request.body.username;
  let password = request.body.password;
  let email = request.body.email;
  connection.query(
    "UPDATE accounts SET password = ?, email = ? WHERE username = ?",
    [password, email, username],
    function (error, results, fields) {
      if (error) throw error;
      request.flash("success_msg", "Saved changes!");
      response.redirect("/dashboard");
      response.end();
    }
  );
});

router.get("/logout", (req, res) => {
  req.flash("success_msg", "Now logged out");
  res.redirect("/login");
  req.session.destroy();
});
module.exports = router;
