const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 경기매치 스키마
const matchSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  label_time: String,
  label_title: String,
  label_cash: String,
  sex: Number,
  label_sex: String,
  level: Number,
  ladder:Number,
  match_grade:String,
  label_level: String,
  remain_cnt: Number,
  apply_status: String
});
module.exports = mongoose.model('Match', matchSchema, 'match');