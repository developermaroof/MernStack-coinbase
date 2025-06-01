// Import mongoose library to connect to MongoDB
const mongoose = require("mongoose");
// Import MongoDB connection string from config file
const { MONGODB_CONNECTION_STRING } = require("../config/index");

// Function to connect to MongoDB database
const connectDB = async () => {
  try {
    // Try to connect to MongoDB using the connection string
    const connection = await mongoose.connect(MONGODB_CONNECTION_STRING);

    // If successful, print success message with database host
    console.log(
      `MongoDB connected successfully: ${connection.connection.host}`
    );
  } catch (error) {
    // If connection fails, print error message
    console.error("Error connecting to MongoDB:", error);
    // Stop the entire application
    process.exit(1);
  }
};

// Export the function so other files can use it
module.exports = connectDB;
