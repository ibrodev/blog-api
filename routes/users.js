const express = require("express");
const createError = require("http-errors");

const User = require("../models/User");
const users = express.Router();

users.get("/", (req, res, next) => {
  User.findAll()
    .then((users) => {
      if (!users) {
        return res.json({ message: "No users found!" });
      }
      res.json({ users });
    })
    .catch((err) => {
      console.log(err.message);
      return next(createError.InternalServerError());
    });
});

module.exports = users;
