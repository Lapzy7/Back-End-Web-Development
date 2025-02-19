const express = require("express");
const morgan = require("morgan");
const users = require("./users");

const app = express();

// Middleware
app.use(morgan("tiny"));

// Routes
app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:name", (req, res) => {
  const searchName = req.params.name.toLowerCase();
  const user = users.find((user) => user.name.toLowerCase() === searchName);

  if (!user) {
    return res.status(404).json({
      message: "Data user tidak ditemukan",
    });
  }

  res.json(user);
});

// 404 route handler
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "resource tidak ditemukan",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "terjadi kesalahan pada server",
  });
});

const hostname = "127.0.0.1";
const port = 3000;
app.listen(port, hostname, () =>
  console.log(`Server running at http://${hostname}:${port}`)
);
