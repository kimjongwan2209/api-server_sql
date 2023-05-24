require("dotenv").config();
const mysql = require("mysql");

const host1 = process.env.DB_HOST;
const user1 = process.env.DB_USER;
const pass = process.env.DB_PASSWORD;
const data = process.env.DATABASE;

const connection = mysql.createConnection({
  host: host1,
  user: user1,
  password: pass,
  database: data,
});
connection.connect();

module.exports = connection;
