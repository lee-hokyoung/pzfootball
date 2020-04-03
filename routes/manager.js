const express = require("express");
const router = express.Router();
const passport = require("passport");
const middle = require("../routes/middle");
const Manager = require("../model/manager");
const Match = require("../model/match");
const Manner = require("../model/manner");
const mongoose = require("mongoose");

router.get("/", middle.isManager, async (req, res) => {
  let user = req.session.passport.user;
  let manager_info = await Manager.findOne();
  res.render("manager_dashboard", {
    title: "퍼즐풋볼 - 대시보드",
    user: user,
    active: "dashboard",
    manager_info: manager_info
  });
});
//  경기일정 관리
router.get("/match", middle.isManager, async (req, res) => {
  let user = req.session.passport.user;
  console.log("id : ", user.user_id);
  let match_list = await Match.aggregate([
    {
      $match: {
        manager_id: mongoose.Types.ObjectId(user._id)
      }
    },
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
  res.render("manager_match", {
    title: "퍼즐풋볼 - 경기일정 관리",
    active: "match",
    user: user,
    match_list: match_list
  });
});
//  경기 정보 읽어오기
// router.get("/match/:id", middle.isManager, async (req, res) => {
//   try {
//     let result = await Match.findOne({
//       _id: mongoose.Types.ObjectId(req.params.id)
//     });
//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.json({ code: 0, message: err.message });
//   }
// });
//  경기 결과 입력 화면
router.get("/match/:id", middle.isManager, async (req, res) => {
  try {
    let user = req.session.passport.user;
    let match_info = await Match.findOne({
      _id: mongoose.Types.ObjectId(req.params.id)
    });
    let manner_list = await Manner.find({});
    res.render("manager_match_result", {
      title: "퍼즐풋볼 - 경기일정 관리",
      active: "match",
      user: user,
      match_info: match_info,
      manner_list: manner_list
    });
  } catch (err) {
    console.error(err);
    res.end();
  }
});
//  매니저 로그인
router.post("/login", middle.isNotLoggedInByManger, async (req, res, next) => {
  passport.authenticate("manager", (authError, user, info) => {
    if (info) {
      let script = `<script>alert("${info.message}"); location.href = "/auth/manager";</script>`;
      return res.send(script);
    }
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      console.log("not user");
      return res.redirect("/auth/manager");
    }
    return req.login(user, async loginError => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      res.redirect("/manager");
    });
  })(req, res, next);
});
//  매니저 로그아웃
router.get("/logout", middle.isLoggedInByManager, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/auth/manager");
});

//  매니저 정보 업데이트
router.put("/", middle.isManager, async (req, res) => {
  try {
    let user = req.session.passport.user;
    let result = await Manager.updateOne(
      { _id: mongoose.Types.ObjectId(user._id) },
      { $set: req.body }
    );
    if (result.ok === 1) {
      res.json({ code: 1, message: "수정되었습니다.", result: result });
    } else {
      res.json({ code: 0, message: "수정실패", result: result });
    }
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
module.exports = router;
