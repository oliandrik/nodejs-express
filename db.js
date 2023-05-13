require("dotenv").config();
const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Root",
  database: "passport",
});

connection.connect(function (error) {
  if (error) {
    throw error;
  } else {
    console.log("Database is working");
  }
});

module.exports = connection;
