const fs = require("fs");
const config = require("../config/setting");
const db = require("../config/db");

const USE_JSON = config.useJson;

exports.getAnalytics = (req, res) => {
  const site = req.query.site;
  if (!site) {
    return res.status(400).send("Missing 'site' query parameter");
  }

  if (USE_JSON) {
    fs.readFile(config.logFile, "utf-8", (err, data) => {
      if (err) return res.status(500).send("Failed to read log file");

      let logs = data
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

      logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const eventCounts = {};
      logs.forEach(log => {
        if (log.event) {
          eventCounts[log.event] = (eventCounts[log.event] || 0) + 1;
        }
      });

      const uniqueEvents = Object.keys(eventCounts).sort();
      res.render("analytics", { site, logs, uniqueEvents, eventCounts });
    });
  } else {
    db.query(
      "SELECT * FROM logs WHERE site = ? ORDER BY timestamp DESC",
      [site],
      (err, results) => {
        if (err) return res.status(500).send("Failed to fetch log from database.");

        const eventCounts = {};
        results.forEach(log => {
          if (log.event) {
            eventCounts[log.event] = (eventCounts[log.event] || 0) + 1;
          }
        });

        const uniqueEvents = Object.keys(eventCounts).sort();

        res.render("analytics", { site, logs: results, uniqueEvents, eventCounts });
      }
    );
  }
};
