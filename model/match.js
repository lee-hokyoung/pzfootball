const mongoose = require('mongoose');
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
  match_time:String,
  match_type:String,    // 2파전, 3파전
  match_grade:String,   // 실력
  ladder:Number,        // 승점
  sex: Number,          // 성별 1: 남성매치, -1: 여성매치, 0: 혼성매치
  personnel: String,    // 정원
  apply_status: String
});
module.exports = mongoose.model('Match', matchSchema, 'match');