const mysql = require("mysql2");
const config = require("./setting");

const pool = mysql.createPool(config.dbConfig);

module.exports = pool;
