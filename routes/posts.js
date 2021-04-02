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

module.exports = posts;
