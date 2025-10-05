// rest-server.js
import express from "express";
const app = express();

const users = new Map();
users.set("1", { id: "1", name: "Alice", email: "alice@example.com" });

app.get("/user", (req, res) => {
  const id = req.query.id || "1";
  const u = users.get(id) || {
    id,
    name: "Unknown",
    email: "unknown@example.com",
  };
  // simulate minimal work (no DB) to match gRPC server behavior
  res.json(u);
});

const port = 3000;
app.listen(port, () =>
  console.log(`REST server listening on http://localhost:${port}`)
);
