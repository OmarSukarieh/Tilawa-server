const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  // res.json(error);
  error.message = err.message;

  // Log to console for dev
  console.log(err);

  if (error.parent) {
    //Not valid UUID
    if (error.parent.code === "22P02") {
      error.message = "Not valid ID";
      error.statusCode = 400;
    }

    // Duplicated Value
    if (error.parent.code === "23505") {
      if (error.fields.email) {
        error.message = `${error.fields.email} is already taken`;
        error.statusCode = 400;
      } else if (error.fields.phone_number) {
        error.message = `${error.fields.phone_number} is already taken`;
        error.statusCode = 400;
      }
    }
  } else {
    // missing fields
    if (error.name === "SequelizeValidationError") {
      let newError = [];
      error.errors.forEach((element) => {
        newError.push(element.message);
      });
      error.message = newError;
      error.statusCode = 400;
    }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;