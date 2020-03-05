const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ManagerSchema = new Schema({
  pz_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  manager_id: { type: String, required: true, unique: true },
  manager_pw: String,
  manager_name: String,
  gender: String,
  birth: String,
  user_phone: String,
  user_addr: String,
  activity_area: String,
  profile_image: String,
  created_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Manager", ManagerSchema);
