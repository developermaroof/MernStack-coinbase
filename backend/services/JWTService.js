// Import jsonwebtoken library to create and verify tokens
const jwt = require("jsonwebtoken");
// Import secret keys from config
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = require("../config/index");
// Import RefreshToken model to store tokens in database
const RefreshToken = require("../models/token");

// Class containing all JWT-related methods
class JWTService {
  // Method to create access token (short-lived)
  static signAccessToken(payload, expiryTime) {
    // Create and return JWT with payload, secret, and expiry time
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: expiryTime,
    });
  }

  // Method to create refresh token (long-lived)
  static signRefreshToken(payload, expiryTime) {
    // Create and return JWT with payload, secret, and expiry time
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: expiryTime,
    });
  }

  // Method to verify access token is valid
  static verifyAccessToken(token) {
    try {
      // Try to verify token with secret key and return decoded data
      return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
      // If verification fails, throw error
      throw new Error("Invalid access token");
    }
  }

  // Method to verify refresh token is valid
  static verifyRefreshToken(token) {
    try {
      // Try to verify token with secret key and return decoded data
      return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
      // If verification fails, throw error
      throw new Error("Invalid refresh token");
    }
  }

  // Method to save refresh token in database
  static async storeRefreshToken(token, userId) {
    try {
      // Create new RefreshToken document
      const newToken = new RefreshToken({
        token: token, // The token string
        userId: userId, // Which user it belongs to
      });

      // Save to database and return the result
      return await newToken.save();
    } catch (error) {
      // If saving fails, log the error
      console.log(error);
    }
  }
}

// Export the class so other files can use it
module.exports = JWTService;
