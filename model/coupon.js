const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 쿠폰 스키마
const couponSchema = new Schema({
  cp_name: String,
  cp_point: Number,
  cp_description: String,
});
module.exports = mongoose.model("Coupon", couponSchema, "coupon");
