const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 경기매치 스키마
const matchSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  label_time: String,
  label_title: String,
  label_cash: String,
  label_sex: String,
  level: Number,
  label_level: String,
  remain_cnt: Number,

  ground_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ground" },
  match_date: String,
  match_time: String,
  match_type: String, // 2파전, 3파전
  match_grade: String, // 실력
  ladder: Number, // 승점제 유무, 1: 승점제, 0: 승점제 x
  sex: Number, // 성별 1: 남성매치, -1: 여성매치, 0: 혼성매치
  personnel: Number, // 정원
  apply_member: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 신청자 list
  match_price: Number, // 금액
  apply_status: String,
  isPlay: { type: Boolean, default: false },
  match_result: {
    winner: Array,
    loser: Array
  }
});
module.exports = mongoose.model("Match", matchSchema, "match");
