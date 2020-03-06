const express = require("express");
const router = express.Router();
const middle = require("../routes/middle");
const passport = require("passport");
const User = require("../model/user");
const Match = require("../model/match");
const Club = require("../model/club");
const mongoose = require("mongoose");

//  클럽 생성 페이지
router.get("/create", middle.isSignedIn, (req, res) => {
  let user_info = req.session.passport;
  res.render("club_create", {
    title: "클럽 생성",
    user_info: user_info
  });
});
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
      club_name: req.body.club_name,
      club_mark: req.body.club_mark,
      club_desc: req.body.club_desc,
      club_region: req.body.club_region,
      club_leader: mongoose.Types.ObjectId(user_info._id),
      club_member: [mongoose.Types.ObjectId(user_info._id)]
    };
    let result = await Club.create(insertData);
    res.json({ code: 1, result: result });
  } catch (err) {
    console.error(err);
    res.json({ code: 0, message: "등록 실패! 관리자에게 문의해 주세요" });
  }
});
//  클럽 리스트
router.get("/list", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport;
  let club_list = await Club.find({});
  res.render("club_list", {
    user_info: user_info,
    title: "퍼즐풋볼 - 클럽 리스트",
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
    title: "퍼즐풋볼 - 클럽",
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
