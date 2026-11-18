const mysql = require("mysql2/promise");

const pool = mysql.createPool({
host: "localhost",
port: 3306,
user: "root",
password: "Kelimo.2008",
database:"FightLab"
});

module.exports = pool;