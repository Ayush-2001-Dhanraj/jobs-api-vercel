const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  const customErr = {
    code: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, Please try again",
  };

  if (err.name === "ValidationError") {
    customErr.msg = Object.values(err.errors)
      .map((key) => key.message)
      .join(", ");
    customErr.code = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "CastError") {
    customErr.msg = `No item found with id ${err.value}`;
    customErr.code = StatusCodes.NOT_FOUND;
  }
  if (err.code && err.code === 11000) {
    customErr.code = StatusCodes.BAD_REQUEST;
    customErr.msg = `Duplicate value enterd for ${Object.keys(
      err.keyValue
    )} feild, please choose another value`;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customErr.code).json({ msg: customErr.msg });
};

module.exports = errorHandlerMiddleware;
