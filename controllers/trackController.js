const fs = require("fs");
const config = require("../config/setting");
const db = require("../config/db");

const USE_JSON = config.useJson;

exports.trackGif = (req, res) => {
  try {
    const data = JSON.parse(decodeURIComponent(req.query.data || "{}"));

    if (!data.site) {
      return res.status(400).json({ error: "Missing 'site' parameter" });
    }

    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
      req.socket.remoteAddress;

    const event = {
      ip,
      timestamp: new Date().toISOString(),
      ...data,
    };

    if (USE_JSON) {
      fs.appendFile(config.logFile, JSON.stringify(event) + "\n", (err) => {
        if (err) {
          console.error("Failed to write log event:", err);
        }
      });
    } else {
      db.query(
        "INSERT INTO logs (ip, timestamp, site, event, device, data) VALUES (?, ?, ?, ?, ?, ?)",
        [
          event.ip,
          event.timestamp,
          event.site,
          event.event || null,
          event.device || null,
          JSON.stringify(event),
        ],
        (err) => {
          if (err) {
            console.error("Failed to insert log event:", err);
          }
        }
      );
    }

    res.setHeader("X-Tracking-Data", encodeURIComponent(JSON.stringify(event)));

    const gif = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      "base64"
    );

    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.end(gif);
  } catch (e) {
    console.error("Invalid tracking data:", e);
    res.sendStatus(400);
  }
};
