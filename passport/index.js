const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const naver = require("./naverStrategy");
const userModel = require("../model/user");
/*
 *   전체 과정
 *   1. 로그인 요청이 들어옴
 *   2. passport.authenticate 메서드 호출
 *   3. 로그인 전략 수행
 *   4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
 *   5. req.login 메서드가 passport.serializeUser 호출
 *   6. req.session 에 사용자 아이디만 저장
 *   7. 로그인 완료
 * */
module.exports = passport => {
  // 세션에 아이디를 저장
  passport.serializeUser((user, done) => {
    // console.log("serializeUser user : ", user);
    done(null, {
      _id: user._id,
      user_id: user.user_id,
      user_name: user.user_name,
      user_nickname: user.user_nickname,
      user_email: user.user_email,
      point: user.point
    });
  });
  // 세션에 저장한 아이디를 통해 사용자 정보 객체 불러오기
  passport.deserializeUser(async (_user, done) => {
    let user = await userModel.findOne(
      { user_id: _user.user_id },
      {
        user_id: 1,
        user_name: 1,
        admin: 1,
        point: 1
      }
    );
    // console.log("deserial uesr : ", user);
    try {
      done(null, user);
    } catch (e) {
      done(e);
    }
  });
  local(passport);
  kakao(passport);
  naver(passport);
};
