const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
	user_id: { type: String, required: true, unique: true },
	user_pw: String,
	user_name: String,
	admin: { type: Boolean, default: false },
	user_phone: String,
	phone1: String,
	phone2: String,
	user_email: String,
	user_nickname: String,
	gender: String, //  남성 : male, 여성 : female
	birth: String,

	height: String, //  키
	weight: String, //  몸무게
	position: String, //  포지션
	skill: String, //  스킬 1 : 초급, 2 : 중급, 3 : 고급
	snsId: String,
	provider: String,
	profile_image: String,
	thumbnail_image: String,
	manner: { type: Number, default: 100 }, //  매너점수 100 점에서 시작
	point: { type: Number, default: 0 },
	passwordResetCode: String,
	certified: { type: Boolean, default: false },
	point_history: [
		{
			chargePoint: { type: Number, default: 0 },
			chargeType: String,
			usePoint: Number,
			refundPoint: Number,
			useCoupon: { type: mongoose.Schema.Types.ObjectId, ref: "CouponHistory" },
			match_id: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
			created_at: { type: Date, default: Date.now },
		},
	],
	favorite_ground: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ground" }],
	// coupon: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coupon" }],
	// [
	//   {
	//     id: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
	//     status: { type: Number, default: 1 },
	//     created_at: { type: Date, default: Date.now },
	//   },
	// ],
	reqRefundPoint: { type: Number, default: 0 },
	created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
