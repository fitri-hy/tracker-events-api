const path = require("path");

module.exports = {
  port: 3000,
  useJson: true,
  logsDir: path.join(__dirname, "../", "logs"),
  logFile: path.join(__dirname, "../", "logs", "events.json"),
  dbConfig: {
    host: "mysql_host",
    user: "mysql_user",
    password: "mysql_password",
    database: "mysql_name_database",
  },
};
