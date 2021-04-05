const express = require("express");
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

posts.post("/create", (req, res) => {
  res.json({ message: "post create url" });
});

module.exports = posts;
