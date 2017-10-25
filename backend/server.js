const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");
const db = require("./handler");
const app = express();

const pool = db.newPool();
app.use(express.static("dist"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(compression());

app.get("/", (req, res) => {
  console.log(req);
  res.sendFile("index.html");
});

app.get("/bundle.js", (req, res) => {
  res.sendFile("bundle.js");
});

app.post("/hslapi", async (req, res) => {
  console.log(req.body);
  const query = await pool.query(
    "SELECT * FROM polls WHERE tripgtfsid IN (" +
      `SELECT gtfsid FROM trips WHERE substring(gtfsid, 1, 8) LIKE '${req.body.tripgtfsid}%' ` +
      `AND time BETWEEN ${req.body.starts} AND ${req.body.ends}` + 
    `) AND stopgtfsid = '${req.body.stopgtfsid}'`
  );
  const arrivalDelays = query.rows.map(row => row.arrivaldelay);
  const totalDelaySeconds = arrivalDelays.reduce((sum, delay) => sum + delay, 0);
  const averageDelay = totalDelaySeconds / query.rows.length;
  const response = {
    "averageDelay": averageDelay
  };
  res.send(response);
});

app.listen(9001);
