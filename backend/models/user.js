// Import mongoose to create database schema
const mongoose = require("mongoose");

// Get Schema constructor from mongoose
const { Schema } = mongoose;

// Define structure for user documents in database
const userSchema = new Schema(
  {
    // User's full name
    name: {
      type: String, // Must be text
      required: true, // Cannot be empty
      trim: true, // Remove extra spaces from beginning and end
    },
    // User's unique username for login
    username: {
      type: String, // Must be text
      required: true, // Cannot be empty
      unique: true, // No two users can have same username
      trim: true, // Remove extra spaces from beginning and end
    },
    // User's email address
    email: {
      type: String, // Must be text
      required: true, // Cannot be empty
      unique: true, // No two users can have same email
      trim: true, // Remove extra spaces from beginning and end
    },
    // User's password (will be hashed before storing)
    password: {
      type: String, // Must be text
      required: true, // Cannot be empty
      minlength: 6, // Must be at least 6 characters long
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create User model from schema
const User = mongoose.model("User", userSchema);

// Export the model so other files can use it
module.exports = User;
