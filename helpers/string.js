const { trimStart } = require("lodash");

const buildURL = (protocol, host, port, path) => {
  return new Promise((resolve, reject) => {
    if (!protocol || !host || !port || !path)
      return reject({ message: "too few arguments" });

    const trimPath = trimStart(path, "./");

    const url = `${protocol}://${host}:${port}/${trimPath}`;

    resolve(url);
  });
};

module.exports = {
  buildURL,
};
