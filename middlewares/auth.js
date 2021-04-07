const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const auth = (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (authorization) {
    const bearer = authorization.split(" ");
    const token = bearer[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
      if (err) {
        return next(
          createError.Unauthorized({ message: "Invalid authorization token" })
        );
      } else {
        req.userID = data.userID;
        next();
      }
    });
  } else {
    return next(
      createError.Unauthorized({
        message: "please provide an authorization header",
      })
    );
  }
};

module.exports = auth;
