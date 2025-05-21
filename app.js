const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const config = require("./config/setting");    
const webRoutes = require("./routes/web");
const apiRoutes = require("./routes/api");  
const app = express();

const port = config.port;
const USE_JSON = config.useJson;

if (USE_JSON) {
  if (!fs.existsSync(config.logsDir)) {
    fs.mkdirSync(config.logsDir);
  }
  if (!fs.existsSync(config.logFile)) {
    fs.writeFileSync(config.logFile, "");
  }
}

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/api", apiRoutes);
app.use("/", webRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port} | USE_JSON = ${USE_JSON}`);
});
