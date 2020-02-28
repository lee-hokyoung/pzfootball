const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// 클럽 리스트 가져오기
router.get("/list", async (req, res) => {
  let user = req.session.passport.user;
  res.render("admin_manager_list", {
    active: "manager",
    user: user,
    title: "퍼즐풋볼 - 매니저 관리"
  });
});
module.exports = router;
