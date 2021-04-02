const getDbURI = () => {
  const {
    DB_HOST = "mongodb://localhost",
    DB_PORT = 27017,
    DB_NAME = "blogapi",
  } = process.env;
  return `${DB_HOST}:${DB_PORT}/${DB_NAME}`;
};

module.exports = getDbURI;
