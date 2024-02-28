const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");
const client = require("./Redis");

const app = express();
const connection = require("./dbConnect");
const router = require("./Routes/router");

// ########### --Redis-- ###########
// const redis = require("redis");
// const redisClient = redis.createClient(6379, "127.0.0.1");

// redisClient.connect();
// redisClient.on("connect", function (err) {
//   console.log("Connected Redis");
// });

dotenv.config();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json());
let PORT = process.env.PORT || 3000;

app.use("/", router);

app.get("/", async (req, res) => {
  res.send("hello, world!");
  // //redish keys STORE
  // let keyName = "normalkey";
  // let getCacheData = await redisClient.get(keyName);
  // let result = {
  //   id: 12,
  //   name: "Test Demo",
  // };

  // let responseArray = "";
  // if (getCacheData) {
  //   responseArray = getCacheData;
  //   console.log("GET Cache");
  // } else {
  //   console.log("SET Cache");
  //   redisClient.set(keyName, JSON.stringify(result));
  // }
  // console.log(getCacheData);
  // res.status(200).json(responseArray);
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
