const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 쿠폰 스키마
const couponSchema = new Schema({
  coupon_id: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: Number, default: 1 }, //  1:발행, 2:사용완료, 3:유효기간 만료, 4:발행취소(회수)
  created: { type: Date, default: Date.now },
});
module.exports = mongoose.model("CouponHistory", couponSchema, "couponHistory");
