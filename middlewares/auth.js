const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (authorization) {
    const bearer = authorization.split(" ");
    const token = bearer[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        next();
      }
    });
  } else {
    res.status(403).json({ error: "Not Authorized" });
  }
};

module.exports = auth;
