// Import mongoose to create database schema
const mongoose = require("mongoose");

// Get Schema constructor from mongoose
const { Schema } = mongoose;

// Define structure for blog documents in database
const blogSchema = new Schema(
  {
    // Blog title field
    title: {
      type: String, // Must be text
      required: true, // Cannot be empty
    },
    // Blog content field
    content: {
      type: String, // Must be text
      required: true, // Cannot be empty
    },
    // Blog photo file path field
    photoPath: {
      type: String, // Must be text (file path)
      required: true, // Cannot be empty
    },
    // Reference to user who wrote the blog
    author: {
      type: Schema.Types.ObjectId, // Must be valid MongoDB ID
      ref: "User", // Points to User collection
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create Blog model from schema
const Blog = mongoose.model("Blog", blogSchema);
// Export the model so other files can use it
module.exports = Blog;
