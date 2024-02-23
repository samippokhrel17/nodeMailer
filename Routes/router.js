const express = require("express");

const { registerUser } = require("../modules/userController");

const router = express.Router();

router.post("/", registerUser);

module.exports = router;
