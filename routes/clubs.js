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

//  팀 생성 페이지
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
    ground: ground,
  });
});
//  팀 생성 확인 페이지
router.get("/create/result", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport;
  let club = await Club.findOne({
    leader_id: mongoose.Types.ObjectId(user_info.user._id),
  });
  res.render("club_create_result", {
    title: "퍼즐풋볼 - 팀 생성 확인",
    club: club,
  });
});
//  팀 중복 이름 체크
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
//  팀 생성
router.post("/create", middle.isSignedIn, async (req, res) => {
  //  이미 가입된 팀이 있는지 확인
  let user_info = req.session.passport.user;
  try {
    let exClub = await Club.findOne({
      club_member: mongoose.Types.ObjectId(user_info._id),
    });
    if (exClub)
      return res.json({
        code: 0,
        message: "이미 가입되어 있는 팀이 있습니다.",
      });
    let insertData = {
      team_type: req.body.team_type,
      team_gender: req.body.team_gender,
      // mainly_ground: req.body.mainly_ground,
      mainly_region: mongoose.Types.ObjectId(req.body.mainly_region),
      mainly_day: req.body.mainly_day,
      mainly_time: req.body.mainly_time,
      club_name: req.body.club_name,
      club_leader: mongoose.Types.ObjectId(user_info._id),
      team_email: req.body.team_email,
      team_phone: req.body.team_phone,
      club_desc: req.body.club_desc,
      uniform_top: req.body.uniform_top,
      uniform_bottom: req.body.uniform_bottom,
      rating: req.body.rating, //  기존 별점에서 초중고로 변경. 1 : 초급, 2 : 중급, 3 : 고급
      team_password: req.body.team_password,
      club_mark: req.body.club_mark,
      club_region: req.body.club_region,
      club_member: [
        { _id: mongoose.Types.ObjectId(user_info._id), user_role: "leader" },
      ],
    };
    let result = await Club.create(insertData);
    res.json({
      code: 1,
      result: result,
      message: "정상적으로 팀이 생성되었습니다.",
    });
  } catch (err) {
    console.error("club create error : ", err);
    res.json({ code: 0, message: "등록 실패! 관리자에게 문의해 주세요" });
  }
});
//  팀 리스트
router.get("/list", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport;
  let club_list = await Club.find({ status: 1 });
  res.render("club_list", {
    user_info: user_info,
    title: "퍼즐풋볼 - 팀 리스트",
    club_list: club_list,
  });
});
//  팀 보기
router.get("/:id", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport;
  let club = await Club.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(req.params.id) },
    },
    {
      $lookup: {
        from: "users",
        localField: "club_member._id",
        foreignField: "_id",
        as: "user_info",
      },
    },
    { $project: { "user_info.user_pw": 0 } },
    {
      $lookup: {
        from: "users",
        localField: "waiting_member",
        foreignField: "_id",
        as: "waiting_info",
      },
    },
    { $project: { "waiting_info.user_pw": 0 } },
  ]);
  res.render("club_read", {
    title: "퍼즐풋볼 - 팀",
    club: club[0],
    user_info: user_info,
  });
});
//  팀 가입하기
router.post("/join", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport;
  try {
    //  이미 가입된 팀인지 확인
    let isExist = await Club.findOne(
      {
        _id: mongoose.Types.ObjectId(req.body._id),
        "club_member._id": mongoose.Types.ObjectId(user_info.user._id),
      },
      {
        _id: 1,
      }
    );
    if (isExist) {
      return res.json({ code: 0, message: "이미 가입된 팀입니다." });
    }
    let result = await Club.updateOne(
      { _id: mongoose.Types.ObjectId(req.body._id) },
      { $push: { waiting_member: mongoose.Types.ObjectId(user_info.user._id) } }
    );
    res.json({ code: 1, message: "가입 요청 완료", result: result });
  } catch (err) {
    res.json({ code: 0, message: res.message });
  }
});
//  팀 멤버 가입 승인하기
router.patch("/approve", middle.isSignedIn, async (req, res) => {
  try {
    let member_id = req.body.user_id;
    let team_id = req.body.team_id;
    let exUser = await Club.findOne({
      _id: mongoose.Types.ObjectId(team_id),
      "club_member._id": mongoose.Types.ObjectId(member_id),
    });
    if (exUser)
      return res.json({ code: 0, message: "이미 가입 승인된 회원입니다." });
    let result = await Club.updateOne(
      {
        _id: mongoose.Types.ObjectId(team_id),
      },
      {
        $push: {
          club_member: {
            _id: mongoose.Types.ObjectId(member_id),
            user_role: "member",
          },
        },
        $pull: { waiting_member: mongoose.Types.ObjectId(member_id) },
      }
    );
    res.json({ code: 1, message: "승인되었습니다", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  팀 가입 신청 취소
router.patch("/cancelJoin", middle.isSignedIn, async (req, res) => {
  try {
    let user_info = req.session.passport;
    console.log("user info : ", user_info);
    let club_info = await Club.findOne(
      {
        waiting_member: mongoose.Types.ObjectId(user_info.user._id),
      },
      { _id: 1 }
    );
    console.log("club info : ", club_info);
    if (club_info) {
      let result = await Club.updateOne(
        {
          _id: mongoose.Types.ObjectId(club_info._id),
        },
        {
          $pull: {
            waiting_member: mongoose.Types.ObjectId(user_info.user._id),
          },
        }
      );
      res.json({ code: 1, message: "취소되었습니다.", result: result });
    } else {
      res.json({
        code: 0,
        message: "가입 취소 에러, 관리자에게 문의해 주세요",
      });
    }
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  팀 멤버 가입 거절
router.patch("/reject", middle.isSignedIn, async (req, res) => {
  try {
    let member_id = req.body.user_id;
    let team_id = req.body.team_id;
    let result = await Club.updateOne(
      {
        _id: mongoose.Types.ObjectId(team_id),
      },
      {
        $pull: { waiting_member: mongoose.Types.ObjectId(member_id) },
      }
    );
    res.json({ code: 1, message: "거절되었습니다.", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  팀 탈퇴하기
router.delete("/:club_id", middle.isSignedIn, async (req, res) => {
  try {
    let user_info = req.session.passport;
    let result = await Club.updateOne(
      { _id: mongoose.Types.ObjectId(req.params.club_id) },
      {
        $pull: { club_member: { _id: user_info.user._id } },
      }
    );
    res.json({ code: 1, message: "탈퇴하였습니다", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  팀원 권한 수정
router.patch("/configMember", middle.isSignedIn, async (req, res) => {
  try {
    //  방장 권한 확인
    let user_info = req.session.passport;
    let isLeader = await Club.findOne({
      _id: mongoose.Types.ObjectId(req.body.team_id),
      club_leader: mongoose.Types.ObjectId(user_info.user._id),
    });
    if (!isLeader) {
      return res.json({ code: 0, message: "권한이 없습니다." });
    } else {
      let result = await Club.updateOne(
        {
          _id: mongoose.Types.ObjectId(req.body.team_id),
          "club_member._id": mongoose.Types.ObjectId(req.body.user_id),
        },
        {
          $set: {
            "club_member.$.user_role": req.body.user_role,
          },
        }
      );
      return res.json({ code: 1, message: "수정했습니다", result: result });
    }
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  팀원 추방하기
router.patch("/exile", middle.isSignedIn, async (req, res) => {
  try {
    //  방장 권한 확인
    let user_info = req.session.passport;
    let isLeader = await Club.findOne({
      _id: mongoose.Types.ObjectId(req.body.club_id),
      club_leader: mongoose.Types.ObjectId(user_info.user._id),
    });
    if (!isLeader) {
      return res.json({ code: 0, message: "추방 권한이 없습니다." });
    } else {
      let result = await Club.updateOne(
        {
          _id: mongoose.Types.ObjectId(req.body.club_id),
          club_leader: mongoose.Types.ObjectId(user_info.user._id),
        },
        {
          $pull: {
            club_member: { _id: mongoose.Types.ObjectId(req.body.user_id) },
          },
        }
      );
      return res.json({ code: 1, message: "추방했습니다", result: result });
    }
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  팀 코드로 팀 찾기
router.get("/find/:team_code", middle.isSignedIn, async (req, res) => {
  try {
    let result = await Club.aggregate([
      { $match: { team_code: req.params.team_code } },
      { $project: { club_leader: 1, club_name: 1, team_phone: 1 } },
      {
        $lookup: {
          from: "users",
          localField: "club_leader",
          foreignField: "_id",
          as: "user_info",
        },
      },
      { $unwind: "$user_info" },
      {
        $project: {
          "user_info._id": 0,
          "user_info.user_pw": 0,
          "user_info.admin": 0,
          "user_info.point": 0,
          "user_info.user_email": 0,
          "user_info.favorite_ground": 0,
        },
      },
    ]);
    res.json({ code: 1, result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
module.exports = router;
