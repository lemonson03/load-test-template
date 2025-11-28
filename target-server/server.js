import express from "express";
const app = express();

app.get("/heavy", (req, res) => {
  let sum = 0;
  for (let i = 0; i < 10_000_000; i++) sum += i; // CPU 부하
  res.json({ status: "ok", sum });
});

app.listen(4000, () => console.log("Target server running!"));
