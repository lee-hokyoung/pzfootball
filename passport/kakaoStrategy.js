const kakaoStrategy = require("passport-kakao").Strategy;
const userModel = require("../model/user");
module.exports = async (passport) => {
	passport.use(
		new kakaoStrategy(
			{
				clientID: process.env.KAKAO_REST_API_KEY,
				clientSecret: "",
				callbackURL: "/auth/kakao/callback",
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const exUser = await userModel.findOne({
						user_id: "kakao_" + profile.id,
						provider: "kakao",
					});
					if (exUser) {
						done(null, exUser);
					} else {
						let kakao_info = profile._json.kakao_account;
						const newUser = await userModel.create({
							user_id: profile.provider + "_" + profile.id,
							user_pw: "kakao_pw",
							user_name: profile.username,
							user_email: kakao_info.email,
							user_nickname: profile.username,
							gender: kakao_info.gender,
							birth: kakao_info.birthday,
							snsId: profile.id,
							provider: "kakao",
							profile_image: kakao_info.profile.profile_image_url,
							thumbnail_image: kakao_info.profile.profile_image_url,
						});
						done(null, newUser);
					}
				} catch (e) {
					console.error(e);
					done(e);
				}
			}
		)
	);
};
