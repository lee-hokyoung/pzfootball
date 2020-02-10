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
      club_reader: mongoose.Types.ObjectId(user_info._id),
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
module.exports = router;
