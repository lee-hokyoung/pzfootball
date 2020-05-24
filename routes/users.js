const express = require("express");
const router = express.Router();
const middle = require("../routes/middle");
const passport = require("passport");
const User = require("../model/user");
const Match = require("../model/match");
const Club = require("../model/club");
const Ground = require("../model/ground");
const Mail = require("../model/mail");
const Region = require("../model/region");
const SessionStore = require("../model/sessionStore");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.get("/login", middle.isNotSignedIn, (req, res) => {
  let user_id = "";
  if (req.cookies.user_id) {
    user_id = req.cookies.user_id;
  }
  res.render("login", {
    user_id: user_id,
  });
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  req.logout();
  res.redirect("/");
});
//  일반 로그인
router.post("/login", middle.isNotSignedIn, (req, res, next) => {
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
      //  아이디 기억하기
      if (req.body.idSave) {
        let maxAge = 7 * 24 * 3600 * 1000;
        res.cookie("user_id", req.body.user_id, { maxAge: maxAge });
      } else {
        res.clearCookie("user_id");
      }
      return req.login(user, async (loginError) => {
        if (loginError) {
          return next(loginError);
        }
        res.json({ code: 1, message: "로그인 성공" });
      });
    })(req, res, next);
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
      return req.login(user, async (loginError) => {
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
      pass: process.env.MASTER_MAIL_PASSWORD, // gmail 계정의 비밀번호를 입력
    },
  });
  let randomNumber = Math.random() * 1000000;
  let verify_number = parseInt(randomNumber);
  let mailOptions = {
    from: process.env.MASTER_MAIL, // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: user_email, // 수신 메일 주소
    subject: "퍼즐풋볼에서 보내는 이메일 인증번호 입니다. ", // 제목
    text: "인증번호 : " + verify_number, // 내용
  };

  transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
      console.log(error);
      res.json({ code: 0, err: error });
    } else {
      // 메일 스키마에 현재 메일과 인증번호를 입력
      await Mail.updateOne(
        {
          user_email: user_email,
        },
        {
          user_email: user_email,
          verify_number: verify_number,
        },
        {
          upsert: true,
        }
      );
      res.json({ code: 1, info: info });
    }
  });
});
// 회원가입
router.get("/join", middle.isNotSignedIn, (req, res) => {
  res.render("join");
});
router.post("/register", async (req, res) => {
  let exUser = await User.findOne({ user_id: req.body.user_id });
  //  사용중인 아이디 확인
  if (exUser) {
    return res.json({ code: 0, message: "이미 사용 중인 아이디가 있습니다" });
  }
  //  인증번호 확인
  let certified = await SessionStore.findOne({
    sessionID: req.sessionID,
    randomNumber: req.body.certifiedNumber,
  });
  if (certified) {
    let result = await User.create(req.body);
    if (result) {
      res.json({ code: 1, result: result });
    } else {
      res.json({ code: 0, result: result });
    }
  } else {
    res.json({ code: 0, message: "인증번호가 다릅니다. 다시 확인해주세요" });
  }
});
// 포인트 조회
router.get("/point", middle.isSignedIn, async (req, res) => {
  try {
    let user_info = req.session.passport;
    let point = await User.findOne({ user_id: user_info.user.user_id }, { point: 1 });
    res.json(point);
  } catch (err) {
    console.error(err);
  }
});
// 포인트 충전
router.post("/point/charge", middle.isSignedIn, async (req, res) => {
  try {
    let user_id = req.session.passport.user.user_id;
    // 현재 포인트 조회
    let user_info = await User.findOne({ user_id: user_id });
    let current_user_point = Number(user_info.point || 0);
    let request_point = Number(req.body.point);
    let after_charge_point = current_user_point + request_point;
    //  누적 포인트
    await User.updateOne(
      { user_id: req.session.passport.user.user_id },
      {
        $push: {
          point_history: {
            chargePoint: request_point,
            chargeType: req.body.chargeType,
          },
        },
      }
    );
    //  포인트 충전
    let result = await User.updateOne(
      {
        user_id: req.session.passport.user.user_id,
      },
      { $set: { point: after_charge_point } }
    );
    res.json({
      code: 1,
      message: "정상적으로 충전되었습니다.",
      result: result,
    });
  } catch (err) {
    res.json({
      code: 0,
      message: "충전 실패! 관리자에게 문의해주세요.",
      err: err,
    });
  }
});
// 마이페이지 화면
router.get("/mypage", middle.isSignedIn, async (req, res) => {
  let d = new Date();
  let month = d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
  let date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
  let today = d.getFullYear() + "-" + month + "-" + date;

  let user_info = req.session.passport;
  let user_id = user_info.user.user_id;
  let user = await User.findOne({ user_id: user_id });

  //  팀워크 점수 계산
  let manner_info = await Match.aggregate([
    {
      $match: {
        "apply_member._id": mongoose.Types.ObjectId(user_info.user._id),
      },
    },
    { $project: { apply_member: 1 } },
    { $unwind: "$apply_member" },
    {
      $match: {
        "apply_member._id": mongoose.Types.ObjectId(user_info.user._id),
      },
    },
    {
      $lookup: {
        from: "manners",
        localField: "apply_member.penalty",
        foreignField: "_id",
        as: "manner_info",
      },
    },
    {
      $project: {
        _id: 1,
        manner_info: 1,
        total: { $sum: "$manner_info.point" },
      },
    },
  ]);
  //  mvp 횟수 계산
  let mvp_info = await Match.countDocuments({
    mvp: mongoose.Types.ObjectId(user_info.user._id),
  });
  //  내 경기 일정
  let match_list = await Match.aggregate([
    {
      $match: {
        "apply_member._id": mongoose.Types.ObjectId(user_info.user._id),
      },
    },
    {
      $lookup: {
        from: "ground",
        localField: "ground_id",
        foreignField: "_id",
        as: "ground_info",
      },
    },
    { $unwind: "$ground_info" },
  ]);
  //  구장 전체 리스트(즐겨찾기 구장 포함)
  let region_group = await Region.aggregate([
    { $match: {} },
    {
      $lookup: {
        from: "ground",
        localField: "_id",
        foreignField: "region",
        as: "info",
      },
    },
    { $unwind: "$info" },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        list: { $push: "$info" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  //  즐겨찾는 구장
  let favorite_match_query = user.favorite_ground.map((v) => {
    return { _id: mongoose.Types.ObjectId(v) };
  });
  let favorite_ground = [];
  if (favorite_match_query.length > 0) {
    favorite_ground = await Ground.aggregate([
      {
        $match: {
          $or: favorite_match_query,
        },
      },
      {
        $project: {
          ground_images: 0,
        },
      },
      // {
      //   $lookup: {
      //     from: "match",
      //     localField: "_id",
      //     foreignField: "ground_id",
      //     as: "match_info",
      //   },
      // },
      {
        $lookup: {
          from: "match",
          let: { local_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$$local_id", "$ground_id"] }, { $gte: ["$match_date", today] }],
                },
              },
            },
          ],
          as: "match_info",
        },
      },
      { $unwind: { path: "$match_info", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          groundName: { $first: "$groundName" },
          groundAddress: { $first: "$groundAddress" },
          count: { $sum: { $cond: [{ $gt: ["$match_info", null] }, 1, 0] } },
        },
      },
    ]);
  }
  //  가입 요청한 팀
  let waiting_club = await Club.findOne({
    waiting_member: mongoose.Types.ObjectId(user_info.user._id),
  });
  //  내 클럽
  let myClub = await Club.findOne({
    "club_member._id": mongoose.Types.ObjectId(user_info.user._id),
  });
  res.render("mypage", {
    title: "내 정보",
    user_info: user_info,
    user: user,
    match_list: match_list,
    myClub: myClub,
    region_group: region_group,
    waiting_club: waiting_club,
    manner_info: manner_info,
    mvp_info: mvp_info,
    favorite_ground: favorite_ground,
  });
});
//  내 정보 수정
router.post("/mypage/myinfo", middle.isSignedIn, async (req, res) => {
  try {
    let user_info = req.session.passport;
    let result = await User.updateOne(
      {
        _id: mongoose.Types.ObjectId(user_info.user._id),
      },
      {
        $set: req.body,
      },
      { $upsert: true }
    );
    res.json({ code: 1, message: "수정했습니다.", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  마이페이지 내 정보 수정
router.put("/mypage/user_info", middle.isSignedIn, async (req, res) => {
  try {
    let user_info = req.session.passport;
    let user_id = user_info.user.user_id;
    let result = await User.updateOne(
      { user_id: user_id },
      {
        $set: {
          user_name: req.body.user_name,
          user_nickname: req.body.user_nickname,
          user_email: req.body.user_email,
        },
      }
    );
    if (result.ok === 1) {
      req.session.passport.user.user_nickname = req.body.user_nickname;
      req.session.passport.user.user_email = req.body.user_email;
      res.json({
        code: 1,
        message: "정상적으로 수정했습니다",
        result: result,
      });
    } else {
      res.json({
        code: 0,
        message: "수정 실패! 관리자에게 문의해주세요",
        result: result,
      });
    }
  } catch (err) {
    res.json({
      code: 0,
      message: "수정 실패! 관리자에게 문의해주세요",
      err: err,
    });
  }
});
// 내 클럽 조회
router.get("/myClub", middle.isSignedIn, async (req, res) => {
  let _id = req.session.passport.user._id;
  try {
    let club = await Club.findOne({
      club_member: mongoose.Types.ObjectId(_id),
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
        as: "ground_info",
      },
    },
    { $unwind: "$ground_info" },
  ]);
  res.render("user_match_detail", {
    match_info: match_info[0],
    user_info: user_info,
    title: "퍼즐풋볼 - 매치 정보",
  });
});
//  내 구장 설정
router.put("/region", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport.user;
  try {
    if (!req.body.ground) return res.json({ code: 0, message: "구장을 선택해주세요" });
    let result = await User.updateOne(
      { _id: user_info._id },
      {
        $set: {
          favorite_ground: req.body.ground.map((v) => {
            return mongoose.Types.ObjectId(v);
          }),
        },
      }
    );
    res.json({ code: 1, message: "적용되었습니다", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  즐겨찾기 구장 추가/제거
router.patch("/favorite", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport.user;
  let isFavorite = req.body.isFavorite;
  let ground_id = req.body.ground_id;
  let update_query = {};
  try {
    //  즐겨찾기 구장 해제
    if (isFavorite) {
      update_query = {
        $pull: { favorite_ground: mongoose.Types.ObjectId(ground_id) },
      };
    }
    //  즐겨찾기 구장 추가
    else {
      update_query = {
        $push: { favorite_ground: mongoose.Types.ObjectId(ground_id) },
      };
    }
    let result = await User.updateOne({ user_id: user_info.user_id }, update_query);
    res.json({ code: 1, message: "수정되었습니다", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  즐겨찾기 구장 해제
router.delete("/favorite", middle.isSignedIn, async (req, res) => {
  try {
    console.log(
      "body : ",
      req.body.ground_id.map((v) => {
        return mongoose.Types.ObjectId(v);
      })
    );
    let user_info = req.session.passport.user;
    let result = await User.updateOne(
      { _id: user_info._id },
      {
        $pullAll: {
          favorite_ground: req.body.ground_id.map((v) => {
            return mongoose.Types.ObjectId(v);
          }),
        },
      }
    );
    res.json({ code: 1, message: "정상적으로 삭제되었습니다", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  휴대폰 끝 4자리로 유저 검색
router.get("/find/:phone", middle.isSignedIn, async (req, res) => {
  try {
    let result = await User.find({ phone2: req.params.phone }, { user_name: 1, user_id: 1 });
    res.json({ code: 1, result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  포인트 환불신청
router.post("/refund", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport.user;
  try {
    let refundPoint = Number(req.body.reqRefundPoint);
    let result = await User.updateOne(
      { user_id: user_info.user_id },
      {
        $inc: { point: -1 * refundPoint, reqRefundPoint: refundPoint },
      }
    );
    if (result.ok === 1) res.json({ code: 1, message: "포인트 환불 신청했습니다." });
    else
      res.json({
        code: 0,
        message: "포인트 환불 신청 실패! 관리자에게 문의해주세요",
      });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  예약 취소
router.delete("/reservation", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport.user;
  try {
    let result = await Match.updateOne(
      { _id: mongoose.Types.ObjectId(req.body.match_id) },
      { $pull: { apply_member: { _id: mongoose.Types.ObjectId(user_info._id) } } }
    );
    res.json({ code: 1, message: "예약이 취소되었습니다.", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  인증번호 발송
router.get("/certify", async (req, res) => {
  try {
    console.log("req : ", req.session);
    let rnd = parseInt(Math.random() * 10000000)
      .toString()
      .substr(0, 4);
    await SessionStore.updateOne(
      { sessionID: req.sessionID },
      { $set: { randomNumber: rnd } },
      { upsert: true }
    );
    res.json({ code: 1, rnd: rnd, req: req.session, sesId: req.sessionID });
  } catch (err) {
    res.json({ code: 0, message: "인증번호 생성 실패" });
  }
});
//  인증번호 확인
router.post("/certify", async (req, res) => {
  try {
    let result = await SessionStore.findOne({
      sessionID: req.sessionID,
      randomNumber: req.body.certifiedNumber,
    });
    res.json({ code: 1, result: result });
  } catch (err) {
    res.json({ code: 0, message: "인증번호 확인 오류" });
  }
});
//  비밀번호 재설정(이메일 인증 방식)
module.exports = router;
