const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Manager = require("../model/manager");

// 클럽 리스트 가져오기
router.get("/list", async (req, res) => {
  let user = req.session.passport.user;
  res.render("admin_manager_list", {
    active: "manager",
    user: user,
    title: "퍼즐풋볼 - 매니저 관리",
    manager_list: []
  });
});
router.post("/register", async (req, res) => {
  try {
    let result = await Manager.create(req.body);
    res.json({ code: 1, message: "등록 성공", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
module.exports = router;
