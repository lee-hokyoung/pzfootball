const NaverStrategy = require("passport-naver").Strategy;
const User = require("../model/user");
module.exports = async passport => {
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENTID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: "/auth/naver/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findOne({
            user_id: "naver_" + profile.id,
            provider: "naver"
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              user_id: profile.provider + "_" + profile.id,
              user_pw: "kakao_pw",
              user_name: profile.displayName,
              user_nickname: profile.displayName,
              // gender: kakao_info.gender,
              birth: profile._json.birthday,
              snsId: profile.id,
              provider: "naver",
              profile_image: profile._json.profile_image,
              thumbnail_image: profile._json.profile_image
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
