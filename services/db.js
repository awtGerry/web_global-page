const mysql = require("mysql2");
const con = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: "",
    database: process.env.DB_NAME
});

module.exports = con;
