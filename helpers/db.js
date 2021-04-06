const mongoose = require("mongoose");

const {
  DB_HOST = "mongodb://localhost",
  DB_PORT = 27017,
  DB_NAME = "blogapi",
} = process.env;

mongoose
  .connect(`${DB_HOST}:${DB_PORT}`, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected");
});

mongoose.connection.on("error", (err) => {
  console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("\nMongoose disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
