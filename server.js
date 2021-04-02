const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const server = express();
const PORT = process.env.APP_PORT || 8000;

server.listen(
  PORT,
  console.log(
    `${process.env.APP_NAME} is running on\n http://localhost:${PORT}`
  )
);
