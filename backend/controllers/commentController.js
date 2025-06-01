// Import Joi library for data validation
const Joi = require("joi");
// Import Comment model to interact with comments in database
const Comment = require("../models/comment");
// Import CommentDTO to format comment data before sending to frontend
const CommentDTO = require("../dto/comment");

// Regular expression pattern to check if a string is a valid MongoDB ID (24 characters)
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

// Object containing all comment-related functions
const commentController = {
  // Function to create a new comment
  async create(req, res, next) {
    // Define validation rules for creating a comment
    const createCommentSchema = Joi.object({
      content: Joi.string().required(), // Comment text is required
      author: Joi.string().regex(mongodbIdPattern).required(), // Author ID must be valid MongoDB ID
      blog: Joi.string().regex(mongodbIdPattern).required(), // Blog ID must be valid MongoDB ID
    });

    // Check if the request data matches our validation rules
    const { error } = createCommentSchema.validate(req.body);

    // If validation fails, pass the error to error handler
    if (error) {
      return next(error);
    }

    // Extract comment data from request body
    const { content, author, blog } = req.body;

    try {
      // Create a new comment object with the provided data
      const newComment = new Comment({ content, author, blog });

      // Save the comment to the database
      await newComment.save();
    } catch (error) {
      // If saving fails, pass error to error handler
      return next(error);
    }

    // Send success response back to frontend
    return res.status(201).json({ message: "Comment created successfully" });
  },

  // Function to get all comments for a specific blog
  async getById(req, res, next) {
    // Define validation rules for getting comments by blog ID
    const getByIdSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(), // Blog ID must be valid
    });

    // Check if the blog ID in URL is valid
    const { error } = getByIdSchema.validate(req.params);

    // If validation fails, pass error to error handler
    if (error) {
      return next(error);
    }

    // Get the blog ID from URL parameters
    const { id } = req.params;

    // Variable to store comments from database
    let comments;

    try {
      // Find all comments for this blog and include author information
      comments = await Comment.find({ blog: id }).populate("author");
    } catch (error) {
      // If database query fails, pass error to error handler
      return next(error);
    }

    // Array to store formatted comment data
    let commentsDto = [];

    // Loop through each comment and format it
    for (let i = 0; i < comments.length; i++) {
      // Create a formatted version of the comment
      const obj = new CommentDTO(comments[i]);

      // Add formatted comment to our array
      commentsDto.push(obj);
    }

    // Send formatted comments back to frontend
    return res.status(200).json({ comments: commentsDto });
  },
};

// Export the controller so other files can use it
module.exports = commentController;
