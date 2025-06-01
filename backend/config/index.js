// Load environment variables from .env file into process.env
const dotenv = require("dotenv").config();

// Get the PORT number from environment variables (like 3000, 5000, etc.)
const PORT = process.env.PORT;

// Get MongoDB database connection string from environment variables
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

// Get secret key for creating access tokens (JWT) from environment variables
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Get secret key for creating refresh tokens (JWT) from environment variables
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Get the backend server URL path from environment variables
const BACKEND_SERVER_PATH = process.env.BACKEND_SERVER_PATH;

// Export all these configuration values so other files can use them
module.exports = {
  PORT,
  MONGODB_CONNECTION_STRING,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  BACKEND_SERVER_PATH,
};
