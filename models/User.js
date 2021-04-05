const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true },
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
  return jwt.sign(
    {
      email: this.email,
    },
    "secrete-key"
  );
};

UserSchema.methods.authJSON = function () {
  return {
    email: this.email,
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

module.exports = mongoose.model("User", UserSchema);
