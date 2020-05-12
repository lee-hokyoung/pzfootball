const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 세션 스키마
const sessSchema = new Schema({
  sessionID: String,
  randomNumber: String,
});
module.exports = mongoose.model("Session", sessSchema, "session");
