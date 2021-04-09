const express = require("express");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const _ = require("lodash");

const Post = require("../models/Post");
const User = require("../models/User");
const posts = express.Router();
const { authentication } = require("../middlewares/auth");

posts.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find().select().populate("author");

    if (posts.length === 0) return res.sendStatus(204);

    res.json(posts);
  } catch (err) {
    console.log(err.message);
    return next(createError.InternalServerError());
  }
});

posts.get("/:postId", async (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId))
    return next(createError.BadRequest("Invalid post id"));

  try {
    const post = await Post.findOne({ _id: postId })
      .select()
      .populate("author");

    if (!post) {
      const error = new Error(`No post found with this ${postId} id`);
      error.status = 404;
      throw error;
    }

    res.json(post);
  } catch (err) {
    if (err.status === 404) {
      return next(createError.NotFound(err.message));
    }
    console.log(err.message);
    return next(createError.InternalServerError());
  }
});

// protected routs middleware
posts.use(authentication);

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

posts.put("/update/:postId", async (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId))
    return next(createError.BadRequest("Invalid post id"));

  try {
    const post = await Post.findOne({ _id: postId })
      .select()
      .populate("author");

    if (!post)
      return res.status(404).json(`No post found with this ${postId} id`);

    if (post.author.id !== req.userID)
      return res.status(403).json("Not authorized");
    const requestBody = ({ title, body } = req.body);

    if (_.isEmpty(requestBody)) return res.status(304).json("not modified");

    const updatedPost = await post.updateOne(requestBody);
    res.status(201).json("Post updated");
  } catch (err) {
    console.log(err.message);
    return next(createError.InternalServerError());
  }
});

posts.delete("/:postId", async (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId))
    return next(createError.BadRequest("Invalid post id"));

  try {
    const post = await Post.findOne({ _id: postId })
      .select()
      .populate("author");

    if (!post)
      return res.status(404).json(`No post found with this ${postId} id`);

    if (post.author.id !== req.userID)
      return res.status(403).json("Not authorized");

    const deletedPost = await post.deleteOne();
    res.status(204);
  } catch (err) {
    console.log(err.message);
    return next(createError.InternalServerError());
  }
});

module.exports = posts;
