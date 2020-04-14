const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 클럽 스키마
const clubSchema = new Schema({
  team_type: String,
  team_gender: String,
  mainly_ground: String,
  mainly_day: String,
  mainly_time: String,
  club_name: { type: String, required: true }, // 클럽명
  club_leader: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // 클럽 리더
  team_email: String,
  team_phone: String,
  club_desc: String, // 클럽 소개
  uniform_top: String,
  uniform_bottom: String,
  rating: Number,
  team_password: String,
  club_mark: String, // 클럽 마크(엠블럼)

  team_code: String,
  status: { type: Number, default: 0 }, // 1:정상, 0:승인요청(대기), 2:승인거부, 9:블랙리스트
  club_region: String, // 클럽 지역
  club_history: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }], // 클럽 경기 history
  club_member: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      user_role: { type: String, default: "member" },
    },
  ], // 클럽 멤버
  waiting_member: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], //  클럽 가입 대기 인원
  updated: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Club", clubSchema, "club");
