// Import express to create routes
const express = require("express");
// Import authentication controller functions
const authController = require("../controllers/authController");
// Import blog controller functions
const blogController = require("../controllers/blogController");
// Import comment controller functions
const commentController = require("../controllers/commentController");
// Import authentication middleware
const auth = require("../middlewares/auth");

// Create new router object
const router = express.Router();

// Authentication routes (no auth middleware needed)
router.post("/register", authController.register); // Sign up new user
router.post("/login", authController.login); // Log in existing user
router.post("/logout", auth, authController.logout); // Log out user (needs auth)
router.get("/refresh", authController.refresh); // Get new access token

// Blog routes (all need authentication)
router.post("/blog", auth, blogController.create); // Create new blog
router.get("/blog/all", auth, blogController.getAll); // Get all blogs
router.get("/blog/:id", auth, blogController.getById); // Get specific blog
router.put("/blog/:id", auth, blogController.update); // Update specific blog
router.delete("/blog/:id", auth, blogController.delete); // Delete specific blog

// Comment routes (all need authentication)
router.post("/comment", auth, commentController.create); // Create new comment
router.get("/comment/:id", auth, commentController.getById); // Get comments for blog

// Export router so main app can use it
module.exports = router;
