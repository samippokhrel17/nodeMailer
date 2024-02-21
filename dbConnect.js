const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "UserDb",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to Mysql server", error);
  } else {
    console.log("Connected to Mysql database");
  }
});

module.export = connection;
