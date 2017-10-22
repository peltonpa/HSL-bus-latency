const express = require("express");
const app = express();

app.get("/", (req, res) => {
  console.log(req);
  res.sendfile(__dirname + "../frontend/dist/index.html");
});

app.listen(9001);