const express = require("express");

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const app = express();
const connection = require("./dbConnect");

dotenv.config();

let PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("hello, world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
