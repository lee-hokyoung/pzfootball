const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  user_id: { type: String, required: true, unique: true },
  user_pw: String,
  user_name: String,
  admin: { type: Boolean, default: false },
  user_phone: String,
  user_email: String,
  user_nickname: String,
  gender: String,
  birth: String,
  snsId: String,
  provider: String,
  profile_image: String,
  thumbnail_image: String,
  created_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model("User", UserSchema);
