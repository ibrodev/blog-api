const express = require("express");
const posts = express.Router();

posts.get("/", (req, res) => {
  res.json("posts route");
});

module.exports = posts;
