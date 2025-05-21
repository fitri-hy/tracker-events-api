const fs = require("fs");
const config = require("../config/setting");
const db = require("../config/db");

const USE_JSON = config.useJson;

exports.downloadLogs = (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).send("Missing 'site' query parameter");

  if (USE_JSON) {
    fs.readFile(config.logFile, "utf-8", (err, data) => {
      if (err) return res.status(500).send("Failed to read log file");

      const logs = data
        .split("\n")
        .filter(Boolean)
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(log => log && log.site === site);

      res.setHeader('Content-Disposition', `attachment; filename="${site}_logs.json"`);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(logs, null, 2));
    });
  } else {
    db.query("SELECT * FROM logs WHERE site = ?", [site], (err, results) => {
      if (err) return res.status(500).send("Failed to fetch log from database.");

      res.setHeader('Content-Disposition', `attachment; filename="${site}_logs.json"`);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(results, null, 2));
    });
  }
};
