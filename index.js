const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");

const app = express();
const connection = require("./dbConnect");
const router = require("./Routes/router");

dotenv.config();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json());
let PORT = process.env.PORT || 3000;

app.use("/register", router);

app.get("/", (req, res) => {
  res.send("hello, world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
