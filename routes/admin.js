const express = require("express");
const router = express.Router();
const passport = require("passport");
const middle = require("../routes/middle");
const mongoose = require("mongoose");
const User = require("../model/user");

router.get("/", middle.isAdmin, async (req, res) => {
  let user = req.session.passport.user;
  res.render("admin_index", {
    title: "퍼즐풋볼-관리자",
    user: user,
  });
});
router.get("/login", middle.isNotLoggedIn, (req, res) => {
  res.render("admin_login", {
    title: "퍼즐풋볼-로그인",
  });
});
router.get("/logout", middle.isAdmin, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/admin/login");
});
router.post("/login", middle.isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (info) {
      return res.send(
        '<script>alert("' +
          info.message +
          '"); location.href = "/admin/login";</script>'
      );
    }
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      console.log("not user");
      return res.redirect("/admin/login");
    }
    return req.login(user, async (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      res.redirect("/admin");
    });
  })(req, res, next);
});

//  회원관리
router.get("/user/list", middle.isAdmin, async (req, res) => {
  let list = await User.aggregate([
    { $match: { admin: false } },
    { $sort: { created_at: 1 } },
    {
      $project: {
        user_id: 1,
        user_name: 1,
        user_phone: 1,
        phone1: 1,
        phone2: 1,
        point: 1,
        manner: 1,
        created_at: 1,
      },
    },
    {
      $lookup: {
        from: "club",
        let: { local_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $gt: [
                  { $indexOfArray: ["$club_member._id", "$$local_id"] },
                  -1,
                ],
              },
            },
          },
          { $project: { club_mark: 0 } },
        ],
        as: "club_info",
      },
    },
    { $unwind: { path: "$club_info", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "club",
        let: { local_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $gt: [{ $indexOfArray: ["$waiting_member", "$$local_id"] }, -1],
              },
            },
          },
          { $project: { _id: 1 } },
        ],
        as: "waiting_info",
      },
    },
    {
      $unwind: {
        path: "$waiting_info",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "match",
        let: { local_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $gt: [
                  { $indexOfArray: ["$apply_member._id", "$$local_id"] },
                  -1,
                ],
              },
            },
          },
          { $project: { apply_member: 1, mvp: 1 } },
        ],
        as: "match_info",
      },
    },
    { $unwind: { path: "$match_info", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "manners",
        localField: "match_info.apply_member.penalty",
        foreignField: "_id",
        as: "manner_info",
      },
    },
    {
      $group: {
        _id: "$_id",
        user_id: { $first: "$user_id" },
        user_name: { $first: "$user_name" },
        user_phone: { $first: "$user_phone" },
        phone1: { $first: "$phone1" },
        phone2: { $first: "$phone2" },
        point: { $first: "$point" },
        club_info: { $first: "$club_info" },
        waiting_info: { $first: "$waiting_info" },
        created_at: { $first: "$created_at" },
        match_count: { $sum: 1 },
        match_data: { $push: "$match_info" },
        manner_info: { $push: "$manner_info" },
      },
    },
  ]);
  let user = req.session.passport.user;
  res.render("admin_user", {
    active: "user",
    title: "퍼즐풋볼 - 회원관리",
    list: list,
    user: user,
  });
});
//  회원관리 - 삭제
router.delete("/user/delete/:id", middle.isAdmin, async (req, res) => {
  try {
    let result = await User.deleteOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    if (result.ok === 1)
      res.json({ code: 1, message: "삭제되었습니다", result: result });
    else res.json({ code: 0, message: "삭제실패", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
module.exports = router;
