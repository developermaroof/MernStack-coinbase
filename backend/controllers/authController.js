// Import Joi for data validation
const Joi = require("joi");
// Import User model to interact with users in database
const User = require("../models/user");
// Import bcrypt to hash passwords
const bcrypt = require("bcryptjs");
// Import UserDTO to format user data
const UserDTO = require("../dto/user");
// Import JWT service for token operations
const JWTService = require("../services/JWTService");
// Import RefreshToken model
const RefreshToken = require("../models/token");

// Regular expression for password validation (8-25 chars, must have uppercase, lowercase, and number)
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

// Object containing all authentication functions
const authController = {
  // Function to register new user
  async register(req, res, next) {
    // Define validation rules for user registration
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(), // Username 5-30 chars
      name: Joi.string().max(30).required(), // Name max 30 chars
      email: Joi.string().email().required(), // Valid email format
      password: Joi.string().pattern(passwordPattern).required(), // Password matching pattern
      confirmPassword: Joi.ref("password"), // Must match password
    });

    // Validate request data against schema
    const { error } = userRegisterSchema.validate(req.body);

    // If validation fails, pass error to error handler
    if (error) {
      return next(error);
    }

    // Extract user data from request
    const { username, name, email, password } = req.body;

    try {
      // Check if email is already used by another user
      const emailInUse = await User.exists({ email });

      // Check if username is already used by another user
      const usernameInUse = await User.exists({ username });

      // If email is already taken, create error
      if (emailInUse) {
        const error = {
          status: 409, // Conflict status
          message: "Email is already in use",
        };
        return next(error);
      }

      // If username is already taken, create error
      if (usernameInUse) {
        const error = {
          status: 409, // Conflict status
          message: "Username is already in use",
        };
        return next(error);
      }
    } catch (error) {
      // If database check fails, pass error to handler
      return next(error);
    }

    // Hash the password before storing (10 rounds of hashing)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Variables to store tokens
    let accessToken;
    let refreshToken;

    // Variable to store user data
    let user;

    try {
      // Create new user object
      const userToRegister = new User({
        username,
        name,
        email,
        password: hashedPassword, // Store hashed password
      });

      // Save user to database
      user = await userToRegister.save();

      // Create access token (expires in 30 minutes)
      accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");

      // Create refresh token (expires in 60 minutes)
      refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
    } catch (error) {
      // If user creation fails, pass error to handler
      return next(error);
    }

    // Store refresh token in database
    await JWTService.storeRefreshToken(refreshToken, user._id);

    // Set access token as HTTP-only cookie (expires in 24 hours)
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours in milliseconds
      httpOnly: true, // Cannot be accessed by JavaScript (security)
    });

    // Set refresh token as HTTP-only cookie (expires in 24 hours)
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours in milliseconds
      httpOnly: true, // Cannot be accessed by JavaScript (security)
    });

    // Format user data for response
    const userDTO = new UserDTO(user);

    // Send success response with user data
    return res.status(201).json({
      user: userDTO,
      message: "User registered successfully",
      auth: true, // User is now authenticated
    });
  },

  // Function to log in existing user
  async login(req, res, next) {
    // Define validation rules for login
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(), // Username required
      password: Joi.string().pattern(passwordPattern).required(), // Password required
    });

    // Validate request data
    const { error } = userLoginSchema.validate(req.body);

    // If validation fails, pass error to handler
    if (error) {
      return next(error);
    }

    // Extract login credentials from request
    const { username, password } = req.body;

    // Variable to store user from database
    let user;

    try {
      // Find user by username
      user = await User.findOne({ username });

      // If user doesn't exist, create error
      if (!user) {
        const error = {
          status: 401, // Unauthorized
          message: "Invalid username",
        };
        return next(error);
      }

      // Compare provided password with hashed password in database
      const match = await bcrypt.compare(password, user.password);

      // If passwords don't match, create error
      if (!match) {
        const error = {
          status: 401, // Unauthorized
          message: "Invalid password",
        };
        return next(error);
      }
    } catch (error) {
      // If database operations fail, pass error to handler
      return next(error);
    }

    // Create new access token for this login session
    const accessToken = JWTService.signAccessToken(
      {
        _id: user._id, // Include user ID in token
      },
      "30m" // Expires in 30 minutes
    );

    // Create new refresh token for this login session
    const refreshToken = JWTService.signRefreshToken(
      {
        _id: user._id, // Include user ID in token
      },
      "60m" // Expires in 60 minutes
    );

    try {
      // Update or create refresh token in database for this user
      await RefreshToken.updateOne(
        {
          _id: user._id, // Find by user ID
        },
        { token: refreshToken }, // Update with new token
        { upsert: true } // Create if doesn't exist
      );
    } catch (error) {
      // If token update fails, pass error to handler
      return next(error);
    }

    // Set access token as HTTP-only cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true, // Security: cannot be accessed by JavaScript
    });

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true, // Security: cannot be accessed by JavaScript
    });

    // Format user data for response
    const userDTO = new UserDTO(user);

    // Send success response
    return res
      .status(200)
      .json({ user: userDTO, auth: true, message: "Login successful" });
  },

  // Function to log out user
  async logout(req, res, next) {
    // Get refresh token from cookies
    const { refreshToken } = req.cookies;

    try {
      // Delete the refresh token from database
      await RefreshToken.deleteOne({
        token: refreshToken,
      });
    } catch (error) {
      // If deletion fails, pass error to handler
      return next(error);
    }

    // Clear access token cookie from browser
    res.clearCookie("accessToken");
    // Clear refresh token cookie from browser
    res.clearCookie("refreshToken");

    // Send logout success response
    res
      .status(200)
      .json({ user: null, auth: false, message: "Logout success" });
  },

  // Function to refresh access token using refresh token
  async refresh(req, res, next) {
    // Get refresh token from cookies
    const originalRefreshToken = req.cookies.refreshToken;

    // Variable to store user ID from token
    let id;

    try {
      // Verify refresh token and extract user ID
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (err) {
      // If token verification fails, user is unauthorized
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }

    try {
      // Check if refresh token exists in database for this user
      const match = RefreshToken.findOne({
        _id: id, // User ID
        token: originalRefreshToken, // Token must match
      });

      // If token not found in database, user is unauthorized
      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };

        return next(error);
      }
    } catch (error) {
      // If database check fails, pass error to handler
      return next(error);
    }

    try {
      // Create new access token
      const accessToken = JWTService.signAccessToken({ _id: id }, "30m");
      // Create new refresh token
      const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

      // Update refresh token in database
      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });

      // Set new access token cookie
      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true,
      });

      // Set new refresh token cookie
      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true,
      });
    } catch (error) {
      // If token creation/update fails, pass error to handler
      return next(error);
    }

    // Get user data from database
    const user = await User.findOne({ _id: id });

    // Format user data
    const userDto = new UserDTO(user);

    // Send success response with user data
    return res.status(200).json({ user: userDto, auth: true, message: "OK" });
  },
};

// Export controller so routes can use it
module.exports = authController;
