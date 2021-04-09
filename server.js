// npm modules
const express = require("express");
const createError = require("http-errors");
const path = require("path");
require("dotenv").config();
require("./helpers/db");

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
server.use("/", require("./routes"));
server.use("/posts", require("./routes/posts"));
server.use("/users", require("./routes/users"));
server.use("/auth", require("./routes/auth"));
server.use("/media", require("./routes/media"));

// catch 404
server.use((req, res, next) => {
  next(createError.NotFound());
});

// handle errors
server.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.APP_PORT || 8000;

server.listen(
  PORT,
  console.log(`${process.env.APP_NAME} is running on\nhttp://localhost:${PORT}`)
);
