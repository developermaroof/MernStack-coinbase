// Import ValidationError from Joi library
const { ValidationError } = require("joi");

// Middleware function to handle all errors in the application
const errorHandler = (err, req, res, next) => {
  // Default error status code (500 = Internal Server Error)
  let status = 500;
  // Default error response data
  let data = {
    message: "Internal Server Error",
  };

  // If error is from Joi validation
  if (err instanceof ValidationError) {
    // Set status to 401 (Unauthorized/Bad Request)
    status = 401;
    // Use the validation error message
    data.message = err.message;

    // Send error response and stop here
    return res.status(status).json(data);
  }

  // If error has a custom status code, use it
  if (err.status) {
    status = err.status;
  }

  // If error has a custom message, use it
  if (err.message) {
    data.message = err.message;
  }

  // Send final error response to frontend
  return res.status(status).json(data);
};

// Export the error handler so app can use it
module.exports = errorHandler;
