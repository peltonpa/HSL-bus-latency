const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Toimii");
});

app.listen(9001);