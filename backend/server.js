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
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (req, res) => {
  console.log(req);
  res.sendFile("index.html");
});

app.get("/bundle.js", (req, res) => {
  res.sendFile("bundle.js");
});

app.post("/hslapi", async (req, res) => {
  let gtfsIdString = "";
  req.body.stopgtfsids.forEach((stop) => {
    gtfsIdString += "'" + stop + "', ";
  });
  gtfsIdString = gtfsIdString.substring(0, gtfsIdString.length - 2);

  const query = await pool.query(
    "SELECT stopgtfsid, avg(arrivalDelay) FROM polls WHERE tripgtfsid IN (" +
      `SELECT gtfsid FROM trips WHERE substring(gtfsid, 1, ${req.body.tripgtfsid.length}) LIKE '${req.body.tripgtfsid}%' ` +
      `AND time BETWEEN ${req.body.starts} AND ${req.body.ends}` + 
    `) AND stopgtfsid IN (${gtfsIdString}) GROUP BY stopgtfsid`
  );

  const response = query.rows.reduce((resDict, row) => {
    resDict[row.stopgtfsid] = { averageDelay: row.avg };
    return resDict;
  }, {});

  res.send(response);
});

app.listen(9001);
