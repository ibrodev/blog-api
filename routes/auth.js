const express = require("express");
const auth = express.Router();

auth.get("/", (req, res) => {
  res.json("auth route");
});

module.exports = auth;
