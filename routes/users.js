const express = require("express");
const mongoose = require("mongoose");
const createError = require("http-errors");

const User = require("../models/User");
const users = express.Router();

users.get("/", (req, res, next) => {
  User.find()
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

users.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId))
    return next(createError.BadRequest("Invalid user id"));

  try {
    const user = await User.findOne({ _id: userId });

    if (!user)
      return res.status(404).json(`No user found with this ${userId} id`);

    res.json(user);
  } catch (err) {
    console.log(err.message);
    return next(createError.InternalServerError());
  }
});

module.exports = users;
