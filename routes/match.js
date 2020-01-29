const express = require("express");
const router = express.Router();
const Match = require("../model/match");
const User = require("../model/user");
const mongoose = require("mongoose");

/* GET home page. */
router.get("/:id", async (req, res, next) => {
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
  res.render("match", {
    title: "퍼즐풋볼 - 매치",
    match_info: match_info[0],
    user_info: user_info
  });
});
// 경기 신청
router.post("/apply", async (req, res) => {
  let match_id = req.body.match_id;
  let match_info = await Match.findOne({
    _id: mongoose.Types.ObjectId(req.body.match_id)
  });
  if (!match_info)
    return res.json({ code: 9, message: "잘못된 매칭 정보입니다" });

  let user_info = req.session.passport.user;
  let user = await User.findOne({ user_id: user_info.user_id });
  // 경기 신청 리스트 확인, 이미 신청한 경기는 중복신청 불가
  let exApply = await Match.findOne(
    { _id: mongoose.Types.ObjectId(match_id) },
    { apply_member: 1 }
  );
  console.log("exApply : ", exApply.apply_member);
  console.log("exApply : ", exApply.apply_member.indexOf(user_info.user_id));
  if (exApply.apply_member.indexOf(user._id) > -1) {
    console.log("exist user");
    return res.json({ code: 9, message: "이미 신청한 경기입니다" });
  }
  // 경기 신청
  let match_result = await Match.updateOne(
    {
      _id: mongoose.Types.ObjectId(match_id)
    },
    { $push: { apply_member: user._id } }
  );
  // 포인트 차감
  let remain_point = user.point - match_info.match_price;
  await User.updateOne(
    { _id: mongoose.Types.ObjectId(user._id) },
    { $set: { point: remain_point } }
  );
  return res.json({
    code: 1,
    result: match_result,
    message: "성공적으로 신청했습니다."
  });
});
module.exports = router;