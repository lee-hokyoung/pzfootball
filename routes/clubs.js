const express = require("express");
const router = express.Router();
const middle = require("../routes/middle");
const passport = require("passport");
const User = require("../model/user");
const Match = require("../model/match");
const Club = require("../model/club");
const Region = require("../model/region");
const Ground = require("../model/ground");
const mongoose = require("mongoose");

//  클럽 생성 페이지
router.get("/create", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport;
  let region = await Region.find({});
  let club = await Club.find({});
  let ground = await Ground.find({});
  res.render("club_create", {
    title: "퍼즐풋볼 - 팀 생성",
    user_info: user_info,
    region: region,
    club: club,
    ground: ground
  });
});
//  클럽 생성 확인 페이지
router.get("/create/result", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport;
  let club = await Club.findOne({
    leader_id: mongoose.Types.ObjectId(user_info.user._id)
  });
  res.render("club_create_result", {
    title: "퍼즐풋볼 - 팀 생성 확인",
    club: club
  });
});
//  클럽 중복 이름 체크
router.get(
  "/chkDuplication/:team_name",
  middle.isSignedIn,
  async (req, res) => {
    try {
      let result = await Club.findOne({ club_name: req.params.team_name });
      if (result) {
        res.json({ code: 0, message: "중복된 팀 이름이 있습니다." });
      } else {
        res.json({ code: 1, message: "사용 가능한 팀 이름 입니다." });
      }
    } catch (err) {
      res.json({ code: 0, result: err.message });
    }
  }
);
//  클럽 생성
router.post("/create", middle.isSignedIn, async (req, res) => {
  //  이미 가입된 클럽이 있는지 확인
  let user_info = req.session.passport.user;
  try {
    let exClub = await Club.findOne({
      club_member: mongoose.Types.ObjectId(user_info._id)
    });
    if (exClub)
      return res.json({
        code: 0,
        message: "이미 가입되어 있는 클럽이 있습니다."
      });
    let insertData = {
      team_type: req.body.team_type,
      team_gender: req.body.team_gender,
      mainly_ground: req.body.mainly_ground,
      mainly_day: req.body.mainly_day,
      mainly_time: req.body.mainly_time,
      club_name: req.body.club_name,
      club_leader: mongoose.Types.ObjectId(user_info._id),
      team_email: req.body.team_email,
      team_phone: req.body.team_phone,
      club_desc: req.body.club_desc,
      uniform_top: req.body.uniform_top,
      uniform_bottom: req.body.uniform_bottom,
      rating: req.body.rating,
      team_password: req.body.team_password,
      club_mark: req.body.club_mark,
      club_region: req.body.club_region,
      club_member: [mongoose.Types.ObjectId(user_info._id)]
    };
    let result = await Club.create(insertData);
    res.json({
      code: 1,
      result: result,
      message: "정상적으로 클럽이 생성되었습니다."
    });
  } catch (err) {
    console.error("club create error : ", err);
    res.json({ code: 0, message: "등록 실패! 관리자에게 문의해 주세요" });
  }
});
//  클럽 리스트
router.get("/list", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport;
  let club_list = await Club.find({ status: 1 });
  res.render("club_list", {
    user_info: user_info,
    title: "퍼즐풋볼 - 팀 리스트",
    club_list: club_list
  });
});
//  클럽 보기
router.get("/:id", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport;
  let club = await Club.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(req.params.id) }
    },
    {
      $lookup: {
        from: "users",
        localField: "club_member",
        foreignField: "_id",
        as: "user_info"
      }
    }
  ]);
  res.render("club_read", {
    title: "퍼즐풋볼 - 팀",
    club: club[0],
    user_info: user_info
  });
});
//  클럽 가입하기
router.post("/join", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport;
  try {
    let isExist = await Club.findOne(
      {
        _id: mongoose.Types.ObjectId(req.body._id),
        club_member: mongoose.Types.ObjectId(user_info.user._id)
      },
      {
        _id: 1
      }
    );
    if (isExist) {
      return res.json({ code: 0, message: "이미 가입된 클럽입니다." });
    }
    let result = await Club.updateOne(
      { _id: mongoose.Types.ObjectId(req.body._id) },
      { $push: { club_member: mongoose.Types.ObjectId(user_info.user._id) } }
    );
    res.json({ code: 1, message: "가입되었습니다", result: result });
  } catch (err) {}
});
//  클럽 탈퇴하기
router.delete("/:club_id", middle.isSignedIn, async (req, res) => {
  try {
    let user_info = req.session.passport;
    let result = await Club.update(
      { _id: mongoose.Types.ObjectId(req.params.club_id) },
      {
        $pull: { club_member: user_info.user._id }
      }
    );
    res.json({ code: 1, message: "탈퇴하였습니다", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
router.patch("/exile", middle.isSignedIn, async (req, res) => {
  try {
    //  방장 권한 확인
    let user_info = req.session.passport;
    let isLeader = await Club.findOne({
      _id: mongoose.Types.ObjectId(req.body.club_id),
      club_leader: mongoose.Types.ObjectId(user_info.user._id)
    });
    if (!isLeader) {
      return res.json({ code: 0, message: "추방 권한이 없습니다." });
    } else {
      let result = await Club.updateOne(
        {
          _id: mongoose.Types.ObjectId(req.body.club_id),
          club_leader: mongoose.Types.ObjectId(user_info.user._id)
        },
        {
          $pull: { club_member: mongoose.Types.ObjectId(req.body.user_id) }
        }
      );
      return res.json({ code: 1, message: "추방했습니다", result: result });
    }
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
module.exports = router;
