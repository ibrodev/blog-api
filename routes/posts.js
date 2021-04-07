const express = require("express");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");

const Post = require("../models/Post");
const User = require("../models/User");
const posts = express.Router();

posts.get("/", (req, res, next) => {
  Post.find()
    .then((posts) => {
      if (posts.length === 0) return res.json({ message: "No user found" });

      res.json(posts);
    })
    .catch((err) => {
      console.log(err.message);
      return next(createError.InternalServerError());
    });
});

posts.get("/:postId", (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId))
    return next(createError.BadRequest("Invalid post id"));

  Post.findOne({ _id: postId })
    .then((post) => {
      if (!post)
        return next(
          createError.NotFound(`No post found with this '${postId}' id`)
        );

      res.json(post);
    })
    .catch((err) => {
      console.log(err.message);
      return next(createError.InternalServerError());
    });
});

posts.get("/:postId/:authorId", (req, res, next) => {
  const { postId, authorId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId))
    return next(createError.BadRequest("Invalid post id"));

  if (!mongoose.Types.ObjectId.isValid(authorId))
    return next(createError.BadRequest("Invalid author id"));
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

  (req, res, next) => {
    const { title, body } = req.body;
    const author = req.userID;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(createError.BadRequest(errors.array()));
    }

    Post.create({ title, body, author })
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
