const express = require("express");
const router = express.Router();
const Match = require("../model/match");
const Ground = require("../model/ground");
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
  let list = await Match.find({});
  res.render("admin_match_result_manage", {
    active: "match_result",
    title: "경기결과 관리"
  });
});
module.exports = router;
