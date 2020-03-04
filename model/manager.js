const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ManagerSchema = new Schema({
  manager_id: { type: String, required: true, unique: true },
  manager_pw: String,
  manager_name: String,
  gender: String,
  birth: String,
  user_phone: String,
  user_addr: String,
  activity_area: String,
  user_nickname: String,
  snsId: String,
  provider: String,
  profile_image: String,
  thumbnail_image: String,
  point: Number,
  created_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Manager", ManagerSchema);
