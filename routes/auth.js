const express = require("express");
const createError = require("http-errors");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

const auth = express.Router();

auth.post(
  "/login",
  check("email")
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("please provide an E-mail address")
    .isEmail()
    .withMessage("please provide a valid email address"),

  check("password")
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("please provide a password")
    .isLength({ min: 8, max: undefined })
    .withMessage("password must be at least 8 characters"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(createError.BadRequest(errors.array()));
    }
    const { email, password } = req.body;

    User.findByEmail(email).then((user) => {
      if (!user || !user.isValidPassword(password)) {
        return next(createError.BadRequest("Invalid Credentials"));
      }

      res.json(user.authJSON());
    });
  }
);

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

  (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(createError.BadRequest(errors.array()));
    }

    const user = new User({ firstName, lastName, email });
    user.setPassword(password);

    user
      .save()
      .then((user) => {
        res.status(201).json({ message: "User created successfully" });
      })
      .catch((err) => {
        console.log(err.message);
        return next(createError.InternalServerError());
      });
  }
);

module.exports = auth;
