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
    user: user
  });
});
router.get("/login", middle.isNotLoggedIn, (req, res) => {
  res.render("admin_login", {
    title: "퍼즐풋볼-로그인"
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
    return req.login(user, async loginError => {
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
  let list = await User.find({});
  let user = req.session.passport.user;
  res.render("admin_user", {
    active: "user",
    title: "퍼즐풋볼 - 회원관리",
    list: list,
    user: user
  });
});
//  회원관리 - 삭제
router.delete("/user/delete/:id", middle.isAdmin, async (req, res) => {
  try {
    let result = await User.deleteOne({
      _id: mongoose.Types.ObjectId(req.params.id)
    });
    if (result.ok === 1)
      res.json({ code: 1, message: "삭제되었습니다", result: result });
    else res.json({ code: 0, message: "삭제실패", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
module.exports = router;
