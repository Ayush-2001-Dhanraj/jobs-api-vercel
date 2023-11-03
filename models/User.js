const mongoose = require("mongoose");
const becrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "name is required"],
    minLength: 1,
    maxLength: 30,
  },
  email: {
    type: String,
    require: [true, "email is required"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email address",
    ],
    minLength: 1,
    maxLength: 30,
    unique: true,
  },
  password: {
    type: String,
    require: [true, "password is required"],
    minLength: 6,
  },
});

UserSchema.pre("save", async function () {
  const salt = await becrypt.genSalt(10);
  this.password = await becrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  const isMatch = await becrypt.compare(enteredPassword, this.password);
  return isMatch;
};

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userID: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

module.exports = mongoose.model("User", UserSchema);
