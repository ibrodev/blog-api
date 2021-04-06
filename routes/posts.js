const express = require("express");
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");

const Post = require("../models/Post");
const posts = express.Router();

posts.get("/", (req, res) => {
  Post.find({})
    .then((posts) => {
      if (!posts) {
        return res.json({ message: "No post found" });
      }
      res.json({ posts });
    })
    .catch((err) => {
      res.json({ err });
    });
});

// protected routs middleware
posts.use(require("../middlewares/auth"));

posts.post(
  "/create",
  check("title")
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("post title is required"),
  check("body")
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("post body is required"),
  check("author_id")
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("post author id is required"),

  (req, res, next) => {
    const { title, body, author_id } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(createError.BadRequest(errors.array()));
    }

    // TODO: validate if author id exists

    Post.create({ title, body, author_id })
      .then((post) => {
        res.status(201).json({ message: "post created" });
      })
      .catch((err) => {
        console.log(err.message);
        return next(createError.InternalServerError());
      });
  }
);

module.exports = posts;
