const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_tracker_db"
});

connection.connect((err, res) => {
    if (err) throw err;
    // console.log("connected with id " + connection.threadId);
});

module.exports = connection;