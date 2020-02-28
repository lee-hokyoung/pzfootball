const express = require("express");
const router = express.Router();
const Club = require("../model/club");
const mongoose = require("mongoose");

// 클럽 리스트 가져오기
router.get("/list", async (req, res) => {
  let user = req.session.passport.user;
  let club_list = await Club.aggregate([
    { $match: {} },
    {
      $lookup: {
        from: "users",
        localField: "club_leader",
        foreignField: "_id",
        as: "reader_info"
      }
    },
    { $unwind: "$reader_info" }
  ]);
  res.render("admin_club_list", {
    active: "club",
    user: user,
    club_list: club_list,
    title: "퍼즐풋볼 - 클럽관리"
  });
});
router.delete("/:id", async (req, res) => {
  try {
    let result = await Club.deleteOne({ _id: req.params.id });
    res.json({ code: 1, message: "삭제 성공" });
  } catch (err) {
    console.error(err);
    res.json({ code: 0, message: "삭제 실패! 관리자에게 문의해 주세요" });
  }
});
module.exports = router;
