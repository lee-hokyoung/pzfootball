const express = require("express");
const router = express.Router();
const middle = require("../routes/middle");
const passport = require("passport");
const User = require("../model/user");
const Match = require("../model/match");
const Club = require("../model/club");
const nodemailer = require("nodemailer");
const Mail = require("../model/mail");
const Region = require("../model/region");
const mongoose = require("mongoose");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});
router.get("/login", middle.isNotLoggedIn, (req, res) => {
  res.render("login");
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  req.logout();
  res.redirect("/");
});
//  일반 로그인
router.post("/login", middle.isNotSignIn, (req, res, next) => {
  let user_id = req.body.user_id;
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
      console.log("user : ", user);
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
//  회원가입 후 로그인 -> 타겟으로 이동
router.post("/login/:target", middle.isNotLoggedIn, async (req, res, next) => {
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
      console.log("target user : ", user);
      return req.login(user, async loginError => {
        if (loginError) {
          console.log("login error : ", loginError);
          return next(loginError);
        }
        let target = req.params.target;
        let url = "/users/mypage";
        if (target === "main") url = "/";
        res.json({ code: 1, target: url });
      });
    })(req, res, next);
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
router.get("/join", middle.isNotLoggedIn, (req, res) => {
  res.render("join");
});
router.post("/register", async (req, res) => {
  let exUser = await User.findOne({ user_id: req.body.user_id });
  if (exUser) {
    return res.json({ code: 0, message: "이미 사용 중인 아이디가 있습니다" });
  }
  let result = await User.create({
    user_id: req.body.user_id,
    user_pw: req.body.user_pw,
    user_name: req.body.user_name,
    user_nickname: req.body.user_name,
    gender: req.body.gender,
    birth: req.body.birth,
    user_email: req.body.user_email
  });
  if (result) {
    res.json({ code: 1, result: result });
  } else {
    res.json({ code: 0, result: result });
  }
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
// 마이페이지 화면
router.get("/mypage", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport;
  let user_id = user_info.user.user_id;
  let user = await User.findOne({ user_id: user_id }, { user_pw: 0 });
  let match_list = await Match.aggregate([
    { $match: { "apply_member.reader": user_id } },
    {
      $lookup: {
        from: "ground",
        localField: "ground_id",
        foreignField: "_id",
        as: "ground_info"
      }
    },
    { $unwind: "$ground_info" }
  ]);
  let region_group = await Region.aggregate([
    { $match: {} },
    {
      $lookup: {
        from: "ground",
        localField: "_id",
        foreignField: "region",
        as: "info"
      }
    },
    { $unwind: "$info" },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        list: { $push: "$info" }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  let waiting_club = await Club.findOne({
    waiting_member: mongoose.Types.ObjectId(user_info.user._id)
  });
  let myClub = await Club.findOne({
    club_member: mongoose.Types.ObjectId(user_info.user._id)
  });
  res.render("mypage", {
    title: "내 정보",
    user_info: user_info,
    user: user,
    match_list: match_list,
    myClub: myClub,
    region_group: region_group,
    waiting_club: waiting_club
  });
});
// 마이페이지 내 정보 수정
router.put("/mypage/user_info", async (req, res) => {
  try {
    let user_info = req.session.passport;
    let user_id = user_info.user.user_id;
    let result = await User.updateOne(
      { user_id: user_id },
      {
        $set: {
          user_name: req.body.user_name,
          user_nickname: req.body.user_nickname,
          user_email: req.body.user_email
        }
      }
    );
    if (result.ok === 1) {
      req.session.passport.user.user_nickname = req.body.user_nickname;
      req.session.passport.user.user_email = req.body.user_email;
      res.json({
        code: 1,
        message: "정상적으로 수정했습니다",
        result: result
      });
    } else {
      res.json({
        code: 0,
        message: "수정 실패! 관리자에게 문의해주세요",
        result: result
      });
    }
  } catch (err) {
    res.json({
      code: 0,
      message: "수정 실패! 관리자에게 문의해주세요",
      err: err
    });
  }
});
// 내 클럽 조회
router.get("/myClub", middle.isSignedIn, async (req, res) => {
  let _id = req.session.passport.user._id;
  try {
    let club = await Club.findOne({
      club_member: mongoose.Types.ObjectId(_id)
    });
    res.json({ code: 1, result: club });
  } catch (err) {
    console.error(err);
    res.json({ code: 0, message: "조회 실패, 관리자에게 문의바랍니다." });
  }
});
//  유저 매치 정보
router.get("/match/:id", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport;
  let match_info = await Match.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
    {
      $lookup: {
        from: "ground",
        localField: "ground_id",
        foreignField: "_id",
        as: "ground_info"
      }
    },
    { $unwind: "$ground_info" }
  ]);
  res.render("user_match_detail", {
    match_info: match_info[0],
    user_info: user_info,
    title: "퍼즐풋볼 - 매치 정보"
  });
});
//  내 구장 설정
router.put("/region", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport.user;
  try {
    if (!req.body.ground)
      return res.json({ code: 0, message: "구장을 선택해주세요" });
    let result = await User.updateOne(
      { _id: user_info._id },
      {
        $set: {
          favorite_ground: req.body.ground.map(v => {
            return mongoose.Types.ObjectId(v);
          })
        }
      }
    );
    res.json({ code: 1, message: "적용되었습니다", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});

module.exports = router;
