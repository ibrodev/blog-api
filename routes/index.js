const express = require("express");
const index = express.Router();

index.get("/", (req, res) => {
  res.send(`
        <h1>This is a Blog RESTful API</h1>
    `);
});

module.exports = index;
