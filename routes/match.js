const express = require("express");
const router = express.Router();
const middle = require("../routes/middle");
const Match = require("../model/match");
const User = require("../model/user");
const mongoose = require("mongoose");

/* GET home page. */
router.get("/:id", middle.isSignedIn, async (req, res) => {
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
  res.render("match", {
    title: "퍼즐풋볼 - 매치",
    match_info: match_info[0],
    user_info: user_info,
  });
});
// router.get("/price/:id", async (req, res) => {
//   let price = await Match.findOne(
//     { _id: mongoose.Types.ObjectId(req.params.id) },
//     { match_price: 1 }
//   );
//   res.json(price);
// });
// 경기 신청
router.post("/apply", async (req, res) => {
  let match_id = req.body.match_id;
  let match_info = await Match.findOne({
    _id: mongoose.Types.ObjectId(match_id),
  });
  if (!match_info)
    return res.json({ code: 9, message: "잘못된 매칭 정보입니다" });

  let user_info = req.session.passport.user;
  let user = await User.findOne({ user_id: user_info.user_id });
  // 경기 신청 리스트 확인, 이미 신청한 경기는 중복신청 불가
  // let exApply = await Match.findOne(
  //   { _id: mongoose.Types.ObjectId(match_id) },
  //   { apply_member: 1 }
  // );
  let apply_member_list = req.body.apply_member_list.split(",");
  let applied_member_ids = match_info.apply_member.map((m) => {
    return m._id;
  });
  let duplicate = false;
  applied_member_ids.forEach((v) => {
    apply_member_list.forEach((w) => {
      if (v.indexOf(w) > -1) {
        duplicate = true;
      }
    });
  });
  if (duplicate) {
    return res.json({
      code: 9,
      message: "해당 경기에 동일한 신청자가 이미 있습니다.",
    });
  }
  if (
    // apply_member 의 형식이 {leader:'', member:''} 로 되어있어서 인덱싱을 위해서 중간에 map을 통해 한번 걸러줌
    match_info.apply_member
      .map((m) => {
        return m.leader;
      })
      .indexOf(user_info.user_id) > -1
  ) {
    return res.json({ code: 9, message: "이미 신청한 경기입니다" });
  }
  // 신청자 + 신청명수 Array 만들기
  let apply_list = [];
  apply_member_list.forEach((v) => {
    apply_list.push({
      _id: mongoose.Types.ObjectId(v),
    });
  });
  // 경기 신청
  let match_result = await Match.updateOne(
    {
      _id: mongoose.Types.ObjectId(match_id),
    },
    { $push: { apply_member: { $each: apply_list } } }
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
    message: "성공적으로 신청했습니다.",
  });
});
router.put("/:id", async (req, res) => {
  let member_id = req.body.id;
  let change = req.body.change;
  try {
    let result = await Match.updateOne(
      {
        _id: req.params.id,
        "apply_member._id": mongoose.Types.ObjectId(member_id),
      },
      { $set: { "apply_member.$.member": change } }
    );
    res.json({
      code: 1,
      message: "정상적으로 수정되었습니다.",
      result: result,
    });
  } catch (err) {
    console.error(err);
    res.json({
      code: 0,
      message: "수정 실패! 관리자에게 문의해주세요",
      err: err,
    });
  }
});

module.exports = router;
