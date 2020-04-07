const LocalStrategy = require("passport-local").Strategy;
const User = require("../model/user");
const Manger = require("../model/manager");

module.exports = passport => {
  //  일반 유저, 어드민
  passport.use(
    new LocalStrategy(
      {
        usernameField: "user_id",
        passwordField: "user_pw"
      },
      async (user, password, done) => {
        try {
          const exUser = await User.findOne({ user_id: user });
          if (exUser) {
            if (exUser.user_pw === password) {
              done(null, exUser);
            } else {
              done(null, false, {
                result: 0,
                message: "비밀번호가 일치하지 않습니다"
              });
            }
          } else {
            done(null, false, {
              result: 2,
              message: "가입되지 않은 회원입니다"
            });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
  //  매니저
  passport.use(
    "manager",
    new LocalStrategy(
      {
        usernameField: "manager_id",
        passwordField: "manager_pw"
      },
      async (user, password, done) => {
        try {
          const exUser = await Manger.findOne({ manager_id: user });
          if (exUser) {
            if (exUser.manager_pw === password) {
              done(null, exUser);
            } else {
              done(null, false, {
                result: 0,
                message: "비밀번호가 일치하지 않습니다"
              });
            }
          } else {
            done(null, false, {
              result: 2,
              message: "가입되지 않은 회원입니다"
            });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
