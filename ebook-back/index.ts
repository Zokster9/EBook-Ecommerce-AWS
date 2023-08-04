import express from "express";

const port = 8000;

const app = express();

app.get("/", (req, res) => {
  res.send("Init");
});

app.listen(port, () => {
  console.log(`Listening  on port ${port}`);
});
