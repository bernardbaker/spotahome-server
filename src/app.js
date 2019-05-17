import "@babel/polyfill";
import express from "express";

// Create an express app
const app = express();

app.get("/", (req, res) => {
  res.sendStatus(200);
});

export default app;
