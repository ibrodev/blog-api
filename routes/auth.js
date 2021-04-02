const express = require("express");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

const auth = express.Router();

auth.post("/login", (req, res) => {});

auth.post(
  "/register",
  check("firstName")
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("first name is required")
    .isAlpha()
    .withMessage("first name can only contain letters (a-zA-Z)"),

  check("lastName")
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("last name is required")
    .isAlpha()
    .withMessage("last name can only contain letters (a-zA-Z)"),

  check("email")
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("email is required")
    .isEmail()
    .withMessage("please provide a valid email address")
    .custom((email) => {
      return User.findByEmail(email).then((user) => {
        if (user) {
          return Promise.reject("E-mail is already in use");
        }
      });
    }),

  check("password")
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("password is required")
    .isLength({ min: 8, max: undefined })
    .withMessage("password must be at least 8 characters"),

  check("passwordConfirmation")
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("password confirmation required")
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error("password confirmation doesn't match");
      }

      return true;
    }),

  (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = new User({ firstName, lastName, email });
    user.setPassword(password);

    user
      .save()
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

module.exports = auth;
