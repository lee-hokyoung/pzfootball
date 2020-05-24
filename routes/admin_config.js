const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Region = require("../model/region");
const Notice = require("../model/notice");
const Manner = require("../model/manner");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

//  환경설정 페이지
router.get("/", async (req, res) => {
  let user = req.session.passport.user;
  let region = await Region.find({});
  let notice = await Notice.find({});
  let manner = await Manner.find({});
  res.render("admin_config", {
    active: "config",
    user: user,
    title: "퍼즐풋볼 - 환경설정",
    region: region,
    notice: notice,
    manner: manner,
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
        _id: mongoose.Types.ObjectId(req.body.id),
      },
      { $set: { name: req.body.val } }
    );
    if (result.ok === 1) res.json({ code: 1, message: "수정 성공", result: result });
    else res.json({ code: 0, message: "수정 실패" });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  지역 삭제
router.delete("/region", async (req, res) => {
  try {
    let result = await Region.deleteOne({
      _id: mongoose.Types.ObjectId(req.body.id),
    });
    res.json({ code: 1, result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  공지사항 등록(temp 폴더 업데이트);
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./temps/notice");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
});
router.post("/uploadTemp", upload.single("notice_img"), async (req, res) => {});
//  공지사항 등록 -> deprecated
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
      _id: mongoose.Types.ObjectId(req.params.id),
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
      _id: mongoose.Types.ObjectId(req.params.id),
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
        _id: mongoose.Types.ObjectId(req.body.id),
      },
      { $set: { activity: req.body.activity } }
    );
    res.json({ code: 1, message: "수정되었습니다", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  매너 점수 관리 등록
router.post("/manner", async (req, res) => {
  try {
    await Manner.deleteMany({});
    let result = await Manner.insertMany(req.body);
    if (result.length > 0) {
      res.json({ code: 1, message: "등록되었습니다" });
    } else {
      res.json({ code: 0, message: "등록 실패!" });
    }
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  매너 점수 삭제
router.delete("/manner/:id", async (req, res) => {
  try {
    let result = await Manner.deleteOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    if (result.ok === 1) res.json({ code: 1, message: "삭제되었습니다." });
    else res.json({ code: 0, message: "삭제 실패!" });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
module.exports = router;
