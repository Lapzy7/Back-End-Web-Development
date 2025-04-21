const mongoose = require("mongoose");

//Buat Schema
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    age: Number,
    status: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

//Buat Model
const User = mongoose.model("User", userSchema);

module.exports = User;
