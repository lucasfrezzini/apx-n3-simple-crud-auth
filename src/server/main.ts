import express from "express";
import ViteExpress from "vite-express";

const app = express();

app.get("/hello", (_, res) => {
  res.send("Hello Vite + TypeScript!");
});

app.get("/auth", (req, res) => {
  const params = req.query;
  res.json(params);
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
