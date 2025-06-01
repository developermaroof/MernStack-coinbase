// Import Joi library for data validation (checking if data is correct format)
const Joi = require("joi");
// Import Node.js file system module to work with files (read, write, delete files)
const fs = require("fs");
// Import our Blog model/schema from the models folder
const Blog = require("../models/blog");
// Import server configuration settings (like server path/URL)
const { BACKEND_SERVER_PATH } = require("../config/index");
// Import BlogDTO class to format blog data for frontend
const BlogDTO = require("../dto/blog");
// Import BlogDetailsDTO class to format detailed blog data for frontend
const BlogDetailsDTO = require("../dto/blog-details");
// Import Comment model to work with blog comments
const Comment = require("../models/comment");

// Regular expression pattern to check if MongoDB ID is valid (24 characters, letters and numbers)
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

// Create the main blog controller object that contains all blog-related functions
const blogController = {
  // Function to create a new blog post
  async create(req, res, next) {
    // Define validation rules for creating a blog - what data is required and in what format
    const createBlogSchema = Joi.object({
      title: Joi.string().required(), // Title must be a string and is required
      author: Joi.string().regex(mongodbIdPattern).required(), // Author ID must match MongoDB pattern and is required
      content: Joi.string().required(), // Content must be a string and is required
      photo: Joi.string().required(), // Photo (base64 string) must be provided and is required
    });

    // Check if the data sent from frontend matches our validation rules
    const { error } = createBlogSchema.validate(req.body);

    // If validation fails, send the error to error handler
    if (error) {
      return next(error);
    }

    // Extract the validated data from request body (destructuring)
    const { title, author, content, photo } = req.body;

    // Convert base64 image string to binary buffer for file storage
    // Remove the "data:image/png;base64," part and keep only the actual image data
    const buffer = Buffer.from(
      photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );

    // Create a unique filename using current timestamp and author ID
    const imagePath = `${Date.now()}-${author}.png`;

    // Try to save the image file to storage folder
    try {
      fs.writeFileSync(`storage/${imagePath}`, buffer);
    } catch (error) {
      // If saving image fails, send error to error handler
      return next(error);
    }

    // Variable to store the new blog object
    let newBlog;

    // Try to create and save new blog to database
    try {
      // Create new blog instance with all the data
      newBlog = await Blog({
        title,
        author,
        content,
        photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`, // Full URL path to the image
      });

      // Save the blog to MongoDB database
      await newBlog.save();
    } catch (error) {
      // If database operation fails, send error to error handler
      return next(error);
    }

    // Create a DTO (Data Transfer Object) to format the blog data for frontend
    const blogDto = new BlogDTO(newBlog);

    // Send success response with the created blog data
    return res.status(201).json({ blog: blogDto });
  },

  // Function to get all blog posts
  async getAll(req, res, next) {
    try {
      // Find all blogs in the database (empty {} means no filter, get everything)
      const blogs = await Blog.find({});

      // Create empty array to store formatted blog data
      const blogsDto = [];

      // Loop through each blog and format it using DTO
      for (let i = 0; i < blogs.length; i++) {
        // Create DTO for current blog
        const dto = new BlogDTO(blogs[i]);

        // Add formatted blog to our array
        blogsDto.push(dto);
      }

      // Send success response with all formatted blogs
      return res.status(200).json({ blogs: blogsDto });
    } catch (error) {
      // If anything goes wrong, send error to error handler
      return next(error);
    }
  },

  // Function to get a single blog by its ID
  async getById(req, res, next) {
    // Define validation rules for the blog ID parameter
    const getByIdSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(), // ID must be valid MongoDB format
    });

    // Validate the ID parameter from the URL
    const { error } = getByIdSchema.validate(req.params);

    // If ID format is wrong, send error
    if (error) {
      return next(error);
    }

    // Variable to store the found blog
    let blog;

    // Extract the ID from URL parameters
    const { id } = req.params;

    try {
      // Find blog by ID and also get author details (populate means get full author info, not just ID)
      blog = await Blog.findOne({ _id: id }).populate("author");
    } catch (error) {
      // If database query fails, send error
      return next(error);
    }

    // Format the blog with detailed information using BlogDetailsDTO
    const blogDto = new BlogDetailsDTO(blog);

    // Send success response with the blog details
    return res.status(200).json({ blog: blogDto });
  },

  // Function to update an existing blog
  async update(req, res, next) {
    // Define validation rules for updating a blog
    const updateBlogSchema = Joi.object({
      blogId: Joi.string().regex(mongodbIdPattern).required(), // Blog ID is required
      author: Joi.string().regex(mongodbIdPattern).required(), // Author ID is required
      title: Joi.string(), // Title is optional (can be updated or not)
      content: Joi.string(), // Content is optional
      photo: Joi.string(), // Photo is optional
    });

    // Validate the update data
    const { error } = updateBlogSchema.validate(req.body);

    // If validation fails, send error
    if (error) {
      return next(error);
    }

    // Extract all the data from request body
    const { blogId, author, title, content, photo } = req.body;

    // Variable to store the existing blog
    let blog;

    try {
      // Find the blog that needs to be updated
      blog = await Blog.findOne({ _id: blogId });
    } catch (error) {
      // If database query fails, send error
      return next(error);
    }

    // If blog doesn't exist, create and send 404 error
    if (!blog) {
      const error = {
        status: 404,
        message: "Blog not found",
      };

      return next(error);
    }

    // Check if user wants to update the photo
    if (photo) {
      // Get the current photo path from the blog
      let previousPhoto = blog.photoPath;

      // Extract just the filename from the full path (get the last part after /)
      previousPhoto = previousPhoto.split("/").at(-1);

      // Delete the old photo file from storage
      fs.unlinkSync(`storage/${previousPhoto}`);

      // Convert new base64 image to binary buffer
      const buffer = Buffer.from(
        photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );

      // Create new unique filename
      const imagePath = `${Date.now()}-${author}.png`;

      try {
        // Save the new image file
        fs.writeFileSync(`storage/${imagePath}`, buffer);
      } catch (error) {
        // If saving fails, send error
        return next(error);
      }

      // Update blog in database with new photo
      await Blog.updateOne(
        { _id: blogId }, // Find blog by this ID
        {
          title,
          content,
          photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`, // Update with new photo path
        }
      );
    } else {
      // If no new photo, just update title and content
      await Blog.updateOne(
        { _id: blogId }, // Find blog by this ID
        {
          title,
          content,
        }
      );
    }

    // Send success response
    return res.status(200).json({ message: "Blog updated successfully" });
  },

  // Function to delete a blog
  async delete(req, res, next) {
    // Define validation rules for delete operation
    const deleteBlogSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(), // Blog ID is required and must be valid format
    });

    // Validate the blog ID from URL parameters
    const { error } = deleteBlogSchema.validate(req.params);

    // If validation fails, send error
    if (error) {
      return next(error);
    }

    // Extract ID from URL parameters
    const { id } = req.params;

    try {
      // Delete the blog from database
      await Blog.deleteOne({ _id: id });
      // Also delete all comments that belong to this blog (cleanup)
      await Comment.deleteMany({ blog: id });
    } catch (error) {
      // If deletion fails, send error
      return next(error);
    }

    // Send success response
    return res.status(200).json({ message: "Blog deleted successfully" });
  },
};

// Export the controller so it can be used in other files (like routes)
module.exports = blogController;
