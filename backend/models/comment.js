// Import mongoose to create database schema
const mongoose = require("mongoose");

// Get Schema constructor from mongoose
const { Schema } = mongoose;

// Define structure for comment documents in database
const commentSchema = new Schema(
  {
    // Comment text content
    content: {
      type: String, // Must be text
      required: true, // Cannot be empty
      trim: true, // Remove extra spaces from beginning and end
    },
    // Reference to user who wrote the comment
    author: {
      type: Schema.Types.ObjectId, // Must be valid MongoDB ID
      ref: "User", // Points to User collection
      required: true, // Cannot be empty
    },
    // Reference to blog this comment belongs to
    blog: {
      type: Schema.Types.ObjectId, // Must be valid MongoDB ID
      ref: "Blog", // Points to Blog collection
      required: true, // Cannot be empty
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create Comment model from schema
const Comment = mongoose.model("Comment", commentSchema);
// Export the model so other files can use it
module.exports = Comment;
