// Import UserDTO to format user data
const UserDTO = require("../dto/user");
// Import User model to get user from database
const User = require("../models/user");
// Import JWT service to verify tokens
const JWTService = require("../services/JWTService");

// Middleware function to check if user is authenticated
const auth = async (req, res, next) => {
  try {
    // Get both tokens from browser cookies
    const { refreshToken, accessToken } = req.cookies;

    // If either token is missing, user is not authenticated
    if (!refreshToken || !accessToken) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }

    // Variable to store user ID from token
    let _id;

    try {
      // Verify access token and extract user ID from it
      _id = JWTService.verifyAccessToken(accessToken)._id;
    } catch (error) {
      // If token is invalid, pass error to error handler
      return next(error);
    }

    // Variable to store user data from database
    let user;

    try {
      // Find user in database using the ID from token
      user = await User.findOne({ _id });
    } catch (error) {
      // If database query fails, pass error to error handler
      return next(error);
    }

    // Format user data (remove sensitive information)
    const userDTO = new UserDTO(user);

    // Add user data to request object so next functions can use it
    req.user = userDTO;

    // Continue to next middleware or route handler
    next();
  } catch (error) {
    // If any error occurs, pass it to error handler
    return next(error);
  }
};

// Export the middleware so routes can use it
module.exports = auth;
