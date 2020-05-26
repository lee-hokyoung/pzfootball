const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../model/user");
const Coupon = require("../model/coupon");
const CouponHistory = require("../model/coupon_history");

//  쿠폰 관리 화면
router.get("/", async (req, res) => {
  let user = req.session.passport.user;
  let coupon = await Coupon.find({});
  let coupon_history = await CouponHistory.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },
    {
      $lookup: {
        from: "coupon",
        localField: "coupon_id",
        foreignField: "_id",
        as: "coupon_info",
      },
    },
    { $unwind: "$coupon_info" },
  ]);

  res.render("admin_coupon", {
    active: "coupon",
    user: user,
    title: "퍼즐풋볼 - 쿠폰관리",
    coupon: coupon,
    published_list: coupon_history,
  });
});
//  쿠폰 등록
router.post("/", async (req, res) => {
  try {
    let result = await Coupon.create(req.body);
    res.json({ code: 1, message: "발행되었습니다.", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  쿠폰 삭제
router.delete("/:id", async (req, res) => {
  try {
    let result = await Coupon.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) });
    res.json({ code: 1, message: "삭제되었습니다.", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  회원 검색
router.get("/findUser/:user_name", async (req, res) => {
  try {
    let regexSearch = new RegExp(req.params.user_name);
    let result = await User.find({ user_name: { $regex: regexSearch } });
    res.json({ code: 1, message: "조회 성공", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  쿠폰 지급
router.post("/publish", async (req, res) => {
  try {
    let result = await CouponHistory.create(req.body);
    res.json({ code: 1, message: "쿠폰이 정상적으로 발급되었습니다.", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
module.exports = router;
