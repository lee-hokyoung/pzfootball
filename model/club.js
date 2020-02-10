const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 클럽 스키마
const clubSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  club_name: { type: String, required: true }, // 클럽명
  club_mark: String, // 클럽 마크(엠블럼)
  club_desc: String, // 클럽 소개
  club_region: String, // 클럽 지역
  club_reader: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // 클럽 리더
  club_history: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }], // 클럽 경기 history
  club_member: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 클럽 멤버
  updated: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Club", clubSchema, "club");
