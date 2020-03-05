const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Manager = require("../model/manager");
const User = require("../model/user");

//  매니저 리스트 가져오기
router.get("/", async (req, res) => {
  let user = req.session.passport.user;
  let manager_list = await Manager.find({});
  let user_list = await User.find({}, { user_name: 1, user_id: 1 });
  res.render("admin_manager_list", {
    active: "manager",
    user: user,
    title: "퍼즐풋볼 - 매니저 관리",
    manager_list: manager_list,
    user_list: user_list
  });
});
//  매니저 등록 및 수정
router.post("/", async (req, res) => {
  try {
    // let data = req.body;
    // if (data.user_id !== "")
    //   data.user_id = mongoose.Types.ObjectId(req.body.user_id);
    let result = await Manager.updateOne(
      { _id: mongoose.Types.ObjectId(req.body._id) },
      { $set: req.body },
      { upsert: true }
    );
    res.json({ code: 1, message: "등록 성공", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  매니저 정보 가져오기
router.get("/:id", async (req, res) => {
  try {
    let manager_info = await Manager.findOne({ _id: req.params.id });
    res.json({ code: 1, manager_info: manager_info });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  매니저 삭제하기
router.delete("/:id", async (req, res) => {
  try {
    let result = await Manager.findOneAndDelete({
      _id: mongoose.Types.ObjectId(req.params.id)
    });
    res.json({
      code: 1,
      message: "정상적으로 삭제되었습니다.",
      result: result
    });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
module.exports = router;
