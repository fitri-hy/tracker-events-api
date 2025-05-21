const express = require("express");
const router = express.Router();

const trackController = require("../controllers/trackController");
const downloadController = require("../controllers/downloadController");
const clearController = require("../controllers/clearController");
const filterController = require("../controllers/filterController");

router.get("/track.gif", trackController.trackGif);
router.get("/download", downloadController.downloadLogs);
router.get("/clear", clearController.clearLogs);
router.get("/clear-all", clearController.clearAllLogs);
router.get("/filter", filterController.filterLogs);

module.exports = router;
