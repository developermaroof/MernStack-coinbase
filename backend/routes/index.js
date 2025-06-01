const express = require("express");
const authController = require("../controllers/authController");
const blogController = require("../controllers/blogController");
const commentController = require("../controllers/commentController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", auth, authController.logout);

router.get("/refresh", authController.refresh);

router.post("/blog", auth, blogController.create);
router.get("/blog/all", auth, blogController.getAll);
router.get("/blog/:id", auth, blogController.getById);
router.put("/blog/:id", auth, blogController.update);
router.delete("/blog/:id", auth, blogController.delete);

router.post("/comment", auth, commentController.create);
router.get("/comment/:id", auth, commentController.getById);

module.exports = router;
