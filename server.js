// npm modules
const express = require("express");
const dotenv = require("dotenv");

// custom modules
const { handleError, ErrorHandler } = require("./helpers/error");
const create404 = require("./middlewares/create404");

dotenv.config();
const server = express();
const PORT = process.env.APP_PORT || 8000;

server.use(create404);

server.use((err, req, res, next) => {
  handleError(err, res);
});

server.listen(
  PORT,
  console.log(
    `${process.env.APP_NAME} is running on\n http://localhost:${PORT}`
  )
);
