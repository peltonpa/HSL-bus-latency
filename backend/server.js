const express = require("express");
const app = express();

app.get("/", (req, res) => {
  console.log(req);
  res.send("Toimii");
});

app.listen(9001);