const redis = require("redis");
const client = redis.createClient({
  port: 6379,
  host: "127.0.0.1",
});

client.connect();
client.on("connect", () => {
  console.log("Connected Redis successfully");
});

client.on("ready", () => {
  console.log("Connected Redis and ready to use....");
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("end", () => {
  console.log("Redis Dis-Connected ");
});

process.on("SIGINT", () => {
  //ctr c enagle sigint it makes client quit from redis
  client.quit();
});

module.exports = client;
