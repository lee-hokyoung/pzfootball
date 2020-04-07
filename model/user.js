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
  gender: String, //  남성 : 1, 여성 : -1
  birth: String,

  height: String, //  키
  weight: String, //  몸무게
  position: String, //  포지션
  skill: String, //  스킬
  snsId: String,
  provider: String,
  profile_image: String,
  thumbnail_image: String,
  manner: { type: Number, default: 100 }, //  매너점수 100 점에서 시작
  point: { type: Number, default: 0 },
  favorite_ground: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ground" }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
