const express = require("express");
const routers = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
// const client = require("./mongodb");
// const ObjectId = require("mongodb").ObjectId;
require("./mongoose");
const Users = require("./User");

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(null, false);
  }
  cb(null, true);
};

const upload = multer({ dest: "public", fileFilter: imageFilter });

// Routing
// Get all users
routers.get("/users", async (req, res) => {
  const users = await Users.find();
  res.json({
    status: "success!!!",
    message: "list users",
    data: users,
  });
});

routers.get("/users/:id", async (req, res) => {
  id = req.params.id;
  const users = await Users.findById(id);
  res.json({
    status: "success",
    message: "list users",
    data: users,
  });
});

routers.post("/users", async (req, res) => {
  const { name, age, status } = req.body;
  const newUser = await Users.create({
    name: name,
    age: age,
    status: status,
  });
  res.json({
    status: "success",
    message: "insert users",
    data: newUser,
  });
});

// Get single user
routers.get("/users/:id", async (req, res) => {
  try {
    const db = client.db("test");
    const user = await db.collection("users").findOne({
      _id: new ObjectId(req.params.id),
    });
    res.status(200).json({
      status: "success",
      message: "single user",
      data: user,
    });
  } catch (error) {
    res.json({
      status: "error",
    });
  }
});

// Insert user
routers.post("/users", async (req, res) => {
  try {
    const db = client.db("test");
    const newUser = req.body; // Assuming the user data is sent in the request body
    const result = await db.collection("users").insertOne(newUser);
    res.status(201).json({
      status: "success",
      message: "User created",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create user",
    });
  }
});
// Update user
routers.put("/users/:id", async (req, res) => {
  try {
    const db = client.db("test");
    const userId = new ObjectId(req.params.id);
    const updatedUser = req.body; // Assuming the updated user data is sent in the request body
    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $set: updatedUser }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User updated",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update user",
    });
  }
});
// Delete user
routers.delete("/users/:id", async (req, res) => {
  try {
    const db = client.db("test");
    const userId = new ObjectId(req.params.id);
    const result = await db.collection("users").deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete user",
    });
  }
});
// Get orders for a user (join/aggregate)
routers.get("/users/:id/orders", async (req, res) => {
  try {
    const db = client.db("test");
    const userId = new ObjectId(req.params.id);
    const orders = await db.collection("orders").aggregate([
      {
        $match: { userId: userId }, // Match orders for the specific user
      },
      {
        $lookup: {
          from: "users", // Join with users collection
          localField: "userId", // Field from orders
          foreignField: "_id", // Field from users
          as: "userDetails", // Output array field
        },
      },
      {
        $unwind: "$userDetails", // Unwind to get user details in the order object
      },
    ]).toArray();
    res.status(200).json({
      status: "success",
      message: "Orders retrieved",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve orders",
    });
  }
});

routers.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (file) {
    const target = path.join(__dirname, "public", file.originalname);
    fs.renameSync(file.path, target); //rename file agar sama dengan original file name
    res.send("file berhasil diupload");
  } else {
    res.send("file gagal diupload");
  }
});

routers.get("/download", (req, res) => {
  const filename = "dummy.png";
  res.download(path.join(__dirname, "/download", filename), "dummy-photo.png");
});

routers.post("/login", (req, res) => {
  const { username, password } = req.body;
  res.status(200).json({
    status: "success",
    message: "Login page",
    data: {
      username: username,
      password: password,
    },
  });
});
routers.get("/", (req, res) => res.send("Hello World"));
routers.get("/about", (req, res) =>
  res.status(200).json({
    status: "success",
    message: "About page",
    data: [],
  })
);
routers.put("/about", (req, res) =>
  res.status(200).json({
    status: "success",
    message: "About page",
    data: [],
  })
);
routers.post("/contoh", (req, res) => res.send("request method POST"));
routers.put("/contoh", (req, res) => res.send("Request method PUT"));
routers.delete("/contoh", (req, res) => res.send("Request method DELETE"));
routers.patch("/contoh", (req, res) => res.send("Request method PATCH"));

routers.all("/universal", (req, res) =>
  res.send(`Request method ${req.method}`)
);
// Routing dinamis
// 1. Menggunakan params
routers.get("/post/:id", (req, res) =>
  res.send(`Artikel ke - ${req.params.id}`)
);
// 2. Menggunakan Query String
routers.get("/post", (req, res) => {
  const { page, sort } = req.query;
  res.send(`Query string= page :${page}, sort : ${sort}`);
});

module.exports = routers;
