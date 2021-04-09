const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, index: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// methods
UserSchema.methods.setPassword = function (plainPassword) {
  this.password = bcrypt.hashSync(plainPassword, 10);
};

UserSchema.methods.isValidPassword = function (plainPassword) {
  return bcrypt.compareSync(plainPassword, this.password);
};

UserSchema.methods.generateJWT = function () {
  const payload = {
    userID: this._id,
  };
  const secret_key = process.env.JWT_SECRET_KEY;
  const options = {
    expiresIn: "6hr",
  };
  return jwt.sign(payload, secret_key, options);
};

UserSchema.methods.authJSON = function () {
  return {
    id: this._id,
    token: this.generateJWT(),
  };
};

// statics
UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

UserSchema.statics.findAll = function () {
  return this.find({}, "firstName lastName email createdAt updatedAt");
};

UserSchema.post("find", function (posts) {
  posts.forEach((post) => {
    post.set("password", null);
  });
});

// virtual
UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", UserSchema);
