const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "UserDb",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to Mysql server", err);
  } else {
    console.log("Connected to Mysql database");
  }
});

// execute any kind of query
function executeQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  connection,
  executeQuery,
};
