// Import mongoose to create database schema
const mongoose = require("mongoose");

// Get Schema constructor from mongoose
const { Schema } = mongoose;

// Define structure for refresh token documents in database
const refreshTokenSchema = new Schema(
  {
    // The actual refresh token string
    token: {
      type: String, // Must be text
      required: true, // Cannot be empty
    },
    // Reference to user this token belongs to
    userId: {
      type: Schema.Types.ObjectId, // Must be valid MongoDB ID
      ref: "User", // Points to User collection
      required: true, // Cannot be empty
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create RefreshToken model from schema
const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

// Export the model so other files can use it
module.exports = RefreshToken;
