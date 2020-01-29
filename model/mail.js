const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 메일 전송 스키마
const mailSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  user_email: String,
  verify_number: Number
});
module.exports = mongoose.model("Mail", mailSchema, "mail");
