// Import express framework
const express = require("express");
// Import database connection function
const connectDB = require("./database");
// Import PORT from config
const { PORT } = require("./config/index");
// Import all routes
const router = require("./routes/index");
// Import error handling middleware
const errorHandler = require("./middlewares/errorHandler");
// Import cookie parser to handle cookies
const cookieParser = require("cookie-parser");

// Create express application
const app = express();

// Middleware to parse cookies from requests
app.use(cookieParser());

// Middleware to parse JSON data from request bodies
app.use(express.json());

// Use all our defined routes
app.use(router);

// Connect to MongoDB database
connectDB();

// Serve static files from storage folder (for blog images)
app.use("/storage", express.static("storage"));

// Use error handler middleware (must be last)
app.use(errorHandler);

// Start server on specified port
app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`));
