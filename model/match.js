const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 경기매치 스키마
const matchSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  // label_time: String,
  // label_title: String,
  // label_cash: String,
  // label_sex: String,
  // level: Number,
  // label_level: String,
  remain_cnt: Number,

  ground_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ground" },
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "Manager" },
  match_date: String,
  match_time: String,
  match_type: String, // 2파전, 3파전
  match_grade: String, // 실력  1: 고급, 2 : 중급, 3 : 초급
  match_score: Number, //  승점
  match_vs: String, //  매치 인원 5: 5 vs 5, 6: 6 vs 6
  ladder: Number, // 승점제 유무, 1: 승점제, 0: 승점제 x
  sex: String, // 성별 1: 남성매치, 2: 여성매치, 3: 혼성매치
  personnel: {
    min: Number,
    max: Number,
  }, // 정원
  apply_member: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      leader: String,
      member: String,
      penalty: [{ type: mongoose.Schema.Types.ObjectId, ref: "Manner" }],
      result: Array,
    },
  ],
  // apply_member: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 신청자 list
  match_price: Number, // 금액
  apply_status: String,
  isPlay: { type: Boolean, default: false },
  mvp: { type: mongoose.Schema.ObjectId, ref: "User" },
  // match_result: {
  //   winner: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  //   loser: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  // }
});
module.exports = mongoose.model("Match", matchSchema, "match");
