const express = require("express");
const authController = require("../controllers/authController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", auth, authController.logout);
module.exports = router;
