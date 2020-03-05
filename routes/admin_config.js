const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Region = require("../model/region");

// 클럽 리스트 가져오기
router.get("/", async (req, res) => {
  let user = req.session.passport.user;
  let region = await Region.find({});
  res.render("admin_config", {
    active: "config",
    user: user,
    title: "퍼즐풋볼 - 환경설정",
    region: region
  });
});
router.post("/region", async (req, res) => {
  try {
    let result = await Region.insertMany(req.body.data);
    res.json({ code: 1, message: "등록되었습니다.", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
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
module.exports = router;
