const express = require("express");

const {
  registerUser,
  login,
  createBlog,
} = require("../modules/userController");
const { sendMail } = require("../modules/sendMail");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/mail", sendMail);
router.post("/blog", createBlog);

module.exports = router;
