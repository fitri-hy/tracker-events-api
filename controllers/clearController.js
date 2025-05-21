const fs = require("fs");
const config = require("../config/setting");
const db = require("../config/db");

const USE_JSON = config.useJson;

exports.clearLogs = (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error: "Missing 'site' query parameter" });

  if (USE_JSON) {
    fs.readFile(config.logFile, "utf-8", (err, data) => {
      if (err) return res.status(500).json({ error: "Failed to read log file" });

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
        .filter(Boolean);

      const filteredLogs = logs.filter(log => log.site !== site);

      fs.writeFile(config.logFile, filteredLogs.map(log => JSON.stringify(log)).join("\n"), err => {
        if (err) return res.status(500).json({ error: "Failed to write log file" });

        res.redirect(`/analytics?site=${encodeURIComponent(site)}`);
      });
    });
  } else {
    db.query("DELETE FROM logs WHERE site = ?", [site], (err) => {
      if (err) return res.status(500).json({ error: "Failed to delete logs from DB" });

      res.redirect(`/analytics?site=${encodeURIComponent(site)}`);
    });
  }
};

exports.clearAllLogs = (req, res) => {
  if (USE_JSON) {
    fs.writeFile(config.logFile, "", (err) => {
      if (err) return res.status(500).json({ error: "Failed to clear log file" });
      res.json({ message: "All logs cleared from JSON file." });
    });
  } else {
    db.query("DELETE FROM logs", (err) => {
      if (err) return res.status(500).json({ error: "Failed to clear logs from DB" });
      res.json({ message: "All logs cleared from database." });
    });
  }
};
