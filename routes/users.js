const express = require("express");
const router = express.Router();
const middle = require("../routes/middle");
const passport = require("passport");
const User = require("../model/user");
const nodemailer = require("nodemailer");
const Mail = require("../model/mail");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
router.post("/login", middle.isNotSignIn, (req, res, next) => {
  let user_id = req.body.user_id;
  console.log("body : ", req.body);
  try {
    passport.authenticate("local", (authError, user, info) => {
      if (info) {
        return res.json({ code: 0, message: info.message });
      }
      if (authError) {
        return next(authenticate);
      }
      if (!user) {
        return res.json({ code: 0, message: "등록되지 않은 회원입니다" });
      }
      return req.login(user, async loginError => {
        if (loginError) {
          return next(loginError);
        }
        res.json({ code: 1, message: "로그인 성공" });
      });
      // console.log("authError : ", authError);
      // console.log("user : ", user);
      // console.log("info : ", info);
      // res.end();
    })(req, res, next);

    //   let exUser = await User.findOne({ user_id: user_id });
    //   console.log("exuser : ", exUser);
    //   if (exUser) {
    //     res.json({ code: 1, message: "로그인 성공" });
    //   } else {
    //     res.json({ code: 0, message: "회원정보가 없습니다" });
    //   }
  } catch (err) {
    console.error(err);
    res.json({ code: 0, message: "로그인 실패" });
  }
});
// 이메일 전송
router.post("/mail_verify", async (req, res) => {
  let user_email = req.body.user_email;
  let exEmail = await User.findOne({ user_email: user_email });
  if (exEmail) {
    return res.json({ code: 0, message: "이미 등록된 이메일입니다" });
  }
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MASTER_MAIL, // gmail 계정 아이디를 입력
      pass: process.env.MASTER_MAIL_PASSWORD // gmail 계정의 비밀번호를 입력
    }
  });
  let randomNumber = Math.random() * 1000000;
  let verify_number = parseInt(randomNumber);
  let mailOptions = {
    from: process.env.MASTER_MAIL, // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: user_email, // 수신 메일 주소
    subject: "퍼즐풋볼에서 보내는 이메일 인증번호 입니다. ", // 제목
    text: "인증번호 : " + verify_number // 내용
  };

  transporter.sendMail(mailOptions, async function(error, info) {
    if (error) {
      console.log(error);
      res.json({ code: 0, err: error });
    } else {
      // 메일 스키마에 현재 메일과 인증번호를 입력
      await Mail.updateOne(
        {
          user_email: user_email
        },
        {
          user_email: user_email,
          verify_number: verify_number
        },
        {
          upsert: true
        }
      );
      res.json({ code: 1, info: info });
    }
  });
});
// 회원가입
router.post("/register", async (req, res) => {
  let exUser = await User.findOne({ user_id: req.body.user_id });
  if (exUser) {
    return res.json({ code: 0, message: "이미 사용 중인 아이디가 있습니다" });
  }
  let result = await User.create({
    user_id: req.body.user_id,
    user_pw: req.body.user_pw,
    user_name: req.body.user_name,
    user_nickname: req.body.user_nickname,
    gender: req.body.gender,
    birth: req.body.birth,
    user_email: req.body.user_email
  });
  res.json(result);
});
// 포인트 조회
router.get("/point", middle.isLoggedIn, async (req, res) => {
  let user_info = req.session.passport;
  let point = await User.findOne(
    { user_id: user_info.user.user_id },
    { point: 1 }
  );
  res.json(point);
});
// 포인트 충전
router.post("/point/charge", middle.isLoggedIn, async (req, res) => {
  try {
    let user_id = req.session.passport.user.user_id;
    // 현재 포인트 조회
    let user_info = await User.findOne({ user_id: user_id });
    let current_user_point = Number(user_info.point || 0);
    let request_point = Number(req.body.point);
    let after_charge_point = current_user_point + request_point;
    let result = await User.updateOne(
      {
        user_id: req.session.passport.user.user_id
      },
      { $set: { point: after_charge_point } }
    );
    res.json({
      code: 1,
      message: "정상적으로 충전되었습니다.",
      result: result
    });
  } catch (err) {
    res.json({
      code: 0,
      message: "충전 실패! 관리자에게 문의해주세요.",
      err: err
    });
  }
});
module.exports = router;
