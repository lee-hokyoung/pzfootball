const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const pointSchema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  coupon_id: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
  match_id: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
  chargePoint: { type: Number, default: 0 },
  chargeType: String,
  usePoint: Number,
  refundPoint: Number,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PointHistory", pointSchema, "pointHistory");
