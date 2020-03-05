const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ManagerSchema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  manager_id: { type: String, required: true, unique: true },
  manager_pw: String,
  manager_name: String,
  gender: String, // 1:남성, 2:여성
  birth: String,
  manager_phone: String,
  activity_area: String,
  profile_image: String,
  created_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Manager", ManagerSchema);
