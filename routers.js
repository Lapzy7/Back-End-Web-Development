const express = require("express");
const routers = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const users = require("./users");

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(null, false);
  }
  cb(null, true);
};

const upload = multer({ dest: "public", fileFilter: imageFilter });

const findUser = (name) => {
  return users.find((user) => user.name.toLowerCase() === name.toLowerCase());
};

// 1. GET: /users
routers.get("/users", (req, res) => {
  res.json(users);
});

// 2. GET: /users/:name
routers.get("/users/:name", (req, res) => {
  const user = findUser(req.params.name);

  if (!user) {
    return res.status(404).json({
      message: "Data user tidak ditemukan",
    });
  }

  res.json(user);
});

// 3. POST /users
routers.post("/users", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Masukan data yang akan diubah",
    });
  }

  const newId =
    users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

  const newUser = {
    id: newId,
    name: name,
  };

  users.push(newUser);
  res.status(201).json({
    status: "success",
    message: "User berhasil ditambahkan",
    data: newUser,
  });
});

// 4. GET: /download
routers.get("/download", (req, res) => {
  const assetsDir = path.join(__dirname, "assets");

  fs.readdir(assetsDir, (err, files) => {
    if (err || files.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Tidak ada file gambar yang tersedia",
      });
    }

    const imageFiles = files.filter((file) =>
      file.match(/\.(jpg|jpeg|png|gif)$/i)
    );

    if (imageFiles.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Tidak ada file gambar yang tersedia",
      });
    }

    const imagePath = path.join(assetsDir, imageFiles[0]);
    res.sendFile(imagePath);
  });
});

// 5. POST: /upload
routers.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (file) {
    const target = path.join(__dirname, "public", file.originalname);
    fs.renameSync(file.path, target);
    res.send("file berhasil diupload");
  } else {
    res.send("file gagal diupload");
  }
});

// 6. PUT: /users/:name
routers.put("/users/:name", (req, res) => {
  const { name: newName } = req.body;
  const userIndex = users.findIndex(
    (user) => user.name.toLowerCase() === req.params.name.toLowerCase()
  );

  if (userIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: "User tidak ditemukan",
    });
  }

  if (!newName) {
    return res.status(400).json({
      status: "error",
      message: "Data name harus diisi",
    });
  }

  users[userIndex].name = newName;

  res.json({
    status: "success",
    message: "User berhasil diupdate",
    data: users[userIndex],
  });
});

// 7. DELETE: /users/:name
routers.delete("/users/:name", (req, res) => {
  const userIndex = users.findIndex(
    (user) => user.name.toLowerCase() === req.params.name.toLowerCase()
  );

  if (userIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: "User tidak ditemukan",
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  res.json({
    status: "success",
    message: "User berhasil dihapus",
    data: deletedUser,
  });
});

module.exports = routers;
