const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Region = require("../model/region");
const Notice = require("../model/notice");

//  환경설정 페이지
router.get("/", async (req, res) => {
  let user = req.session.passport.user;
  let region = await Region.find({});
  let notice = await Notice.find({});
  res.render("admin_config", {
    active: "config",
    user: user,
    title: "퍼즐풋볼 - 환경설정",
    region: region,
    notice: notice
  });
});
//  지역 등록
router.post("/region", async (req, res) => {
  try {
    let result = await Region.insertMany(req.body.data);
    res.json({ code: 1, message: "등록되었습니다.", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  지역 수정
router.patch("/region", async (req, res) => {
  try {
    let result = await Region.updateOne(
      {
        _id: mongoose.Types.ObjectId(req.body.id)
      },
      { $set: { name: req.body.val } }
    );
    if (result.ok === 1)
      res.json({ code: 1, message: "수정 성공", result: result });
    else res.json({ code: 0, message: "수정 실패" });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  지역 삭제
router.delete("/region", async (req, res) => {
  try {
    let result = await Region.deleteOne({
      _id: mongoose.Types.ObjectId(req.body.id)
    });
    res.json({ code: 1, result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  공지사항 등록
router.post("/notice", async (req, res) => {
  try {
    let result = await Notice.create(req.body);
    res.json({ code: 1, message: "등록 되었습니다", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  공지사항 읽기 (나중에 할 것)
router.get("/notice/:id", async (req, res) => {
  try {
    let result = await Notice.findOne({
      _id: mongoose.Types.ObjectId(req.params.id)
    });
    res.json({ code: 1, result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  공지사항 삭제
router.delete("/notice/:id", async (req, res) => {
  try {
    let result = await Notice.deleteOne({
      _id: mongoose.Types.ObjectId(req.params.id)
    });
    if (result.ok === 1) {
      res.json({ code: 1, message: "삭제되었습니다", result: result });
    } else {
      res.json({ code: 0, message: "삭제실패", result: result });
    }
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  공지사항 활성화/비활성화
router.put("/notice", async (req, res) => {
  try {
    let result = await Notice.updateOne(
      {
        _id: mongoose.Types.ObjectId(req.body.id)
      },
      { $set: { activity: req.body.activity } }
    );
    res.json({ code: 1, message: "수정되었습니다", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});

module.exports = router;
