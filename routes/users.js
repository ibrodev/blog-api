const express = require("express");
const User = require("../models/User");
const users = express.Router();

users.get("/", (req, res) => {
  User.findAll()
    .then((users) => {
      if (!users) {
        return res.json({ message: "No users found!" });
      }
      res.json({ users });
    })
    .catch((err) => {
      res.json({ err });
    });
});

module.exports = users;
