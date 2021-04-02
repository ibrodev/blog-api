class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, res) => {
  const { statusCode, message } = err;
  const ENV = process.env.APP_ENV || "development";

  if (ENV === "development") {
    console.log(err);
  }

  res.status(statusCode).json({
    message,
  });
};

module.exports = { ErrorHandler, handleError };
