const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isPasswordSame = await user.comparePassword(password);

  if (!isPasswordSame) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, token: user.createJWT() });
};

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name }, token: user.createJWT() });
};

module.exports = { login, register };
