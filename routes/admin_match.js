const express = require("express");
const router = express.Router();
const Match = require("../model/match");
const Ground = require("../model/ground");
const Manager = require("../model/manager");
const mongoose = require("mongoose");

// 일정 리스트 가져오기
router.get("/list", async (req, res) => {
  let user = req.session.passport.user;
  let list = await Match.aggregate([{ $match: {} }]);
  res.render("admin_match", {
    active: "match",
    title: "퍼즐풋볼 - 일정관리",
    user: user,
    list: list
  });
});
// 일별, 경기장별 등록화면(리스트)
router.get("/register/:date?/:ground_id?", async (req, res) => {
  let d = new Date();
  let today = d.getFullYear() + "-" + d.getMonth() + 1 + "-" + d.getDate();
  let date = req.params.date || today;
  let ground_id = req.params.ground_id || "";
  let user = req.session.passport.user;
  let ground = await Ground.find({});
  let match_list = [];
  if (ground_id !== "") {
    match_list = await Match.aggregate([
      {
        $match: {
          ground_id: mongoose.Types.ObjectId(ground_id),
          match_date: date
        }
      }
    ]);
  }

  res.render("admin_match_register", {
    active: "match",
    user: user,
    title: "퍼즐풋볼 - 일정등록",
    ground: ground,
    selectedDate: date,
    ground_id: ground_id,
    match_list: match_list
  });
});
// 일정 등록
router.post("/register", async (req, res) => {
  let result = await Match.create(req.body);
  res.json(result);
});
// 일정 수정
router.put("/:id", async (req, res) => {
  let result = await Match.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.json(result);
});
// 일정 삭제
router.delete("/:id", async (req, res) => {
  let result = await Match.deleteOne({ _id: req.params.id });
  res.json(result);
});
// 경기결과 관리
router.get("/result/manage", async (req, res) => {
  let user = req.session.passport.user;
  let match_list = await Match.aggregate([
    { $match: { apply_member: { $gt: [] } } },
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
  let manager_list = await Manager.find({}, { manager_name: 1, manager_id: 1 });
  res.render("admin_match_result_manage", {
    active: "match_result",
    title: "경기결과 관리",
    user: user,
    match_list: match_list,
    manager_list: manager_list
  });
});
// 경기 정보 읽기
router.get("/:id", async (req, res) => {
  let match = await Match.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.params.id) } }
  ]);
  res.json(match[0]);
});
// 경기 결과 입력
router.put("/result/:id", async (req, res) => {
  let match = await Match.findOne({
    _id: mongoose.Types.ObjectId(req.params.id)
  });
  // 경기결과 입력을 위해
  let list = [],
    data = req.body;
  for (var key in data) {
    if (key !== "mvp_id") list.push({ _id: key, val: data[key] });
  }
  try {
    await Match.updateOne(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      { $set: { mvp: mongoose.Types.ObjectId(req.body.mvp_id), isPlay: true } }
    );
    for (var item of list) {
      await Match.updateOne(
        {
          _id: mongoose.Types.ObjectId(req.params.id),
          "apply_member._id": mongoose.Types.ObjectId(item._id)
        },
        { $set: { "apply_member.$.result": item.val } }
      );
    }
    res.json({ code: 1, message: "정상적으로 수정되었습니다." });
  } catch (err) {
    console.error(err);
    res.json({
      code: 0,
      err: err,
      message: "수정 실패! 관리자에게 문의해주세요"
    });
  }
});
//  매니저 경기 매칭
router.put("/assign/manager", async (req, res) => {
  console.log("assign");
  console.log("body : ", req.body);
  try {
    let result = await Match.updateOne(
      { _id: mongoose.Types.ObjectId(req.body.game_id) },
      { $set: { manager_id: mongoose.Types.ObjectId(req.body.manager_id) } }
    );
    if (result.ok === 1) {
      res.json({ code: 1, message: "매칭 성공", result: result });
    } else {
      res.json({ code: 0, message: "매칭 실패" });
    }
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
module.exports = router;
