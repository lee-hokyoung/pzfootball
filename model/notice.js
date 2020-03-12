const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NoticeSchema = new Schema({
  notice_img: String,
  activity: { type: Boolean, default: false }
});
module.exports = mongoose.model("Notice", NoticeSchema);
