const { ErrorHandler } = require("../helpers/error");

const create404 = (res, req, next) => {
  const error = new ErrorHandler(404, "Not Found");
  next(error);
};

module.exports = create404;
