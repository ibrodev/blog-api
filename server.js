// npm modules
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// custom modules
const { handleError } = require("./helpers/error");
const create404 = require("./middlewares/create404");
const getDbURI = require("./helpers/db");

dotenv.config();
const server = express();
const PORT = process.env.APP_PORT || 8000;

mongoose
  .connect(getDbURI(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.log(err));

// routes
server.use("/", require("./routes"));
server.use("/posts", require("./routes/posts"));
server.use("/users", require("./routes/users"));
server.use("/auth", require("./routes/auth"));

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
