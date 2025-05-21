const fs = require("fs");
const config = require("../config/setting");
const db = require("../config/db");

const USE_JSON = config.useJson;

exports.filterLogs = (req, res) => {
  const { event, device } = req.query;

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

      const filtered = logs.filter(e => {
        const matchEvent = event ? e.event === event : true;
        const matchDevice = device ? e.device === device : true;
        return matchEvent && matchDevice;
      });

      res.json(filtered);
    });
  } else {
    let query = "SELECT * FROM logs WHERE 1=1";
    const params = [];

    if (event) {
      query += " AND event = ?";
      params.push(event);
    }
    if (device) {
      query += " AND device = ?";
      params.push(device);
    }

    db.query(query, params, (err, results) => {
      if (err) return res.status(500).json({ error: "Failed to fetch log from database." });

      res.json(results);
    });
  }
};
