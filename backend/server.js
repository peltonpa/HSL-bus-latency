const express = require("express");
const path = require("path");
const app = express();

app.use(express.static("dist"));

app.get("/", (req, res) => {
  console.log(req);
  res.sendFile("index.html");
});

app.get("/bundle.js", (req, res) => {
  res.sendFile("bundle.js");
});

app.listen(9001);
