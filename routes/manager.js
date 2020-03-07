const express = require("express");
const router = express.Router();
const passport = require("passport");
const middle = require("../routes/middle");
const User = require("../model/user");

router.get("/", middle.isManager, async (req, res) => {
  let user = req.session.passport.user;
  res.render("manager_dashboard", {
    title: "퍼즐풋볼 - 대시보드",
    user: user,
    active: "dashboard"
  });
});
router.get("/match", middle.isManager, async (req, res) => {
  let user = req.session.passport.user;
  res.render("manager_match", {
    title: "퍼즐풋볼 - 경기일정 관리",
    active: "match",
    user: user
  });
});
router.post("/login", middle.isNotLoggedInByManger, async (req, res, next) => {
  passport.authenticate("manager", (authError, user, info) => {
    console.log("authError : ", authError);
    console.log("info : ", info);
    if (info) {
      let script = `<script>alert("${info.message}"); location.href = "/auth/manager";</script>`;
      return res.send(script);
    }
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      console.log("not user");
      return res.redirect("/auth/manager");
    }
    return req.login(user, async loginError => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      res.redirect("/manager");
    });
  })(req, res, next);
});
module.exports = router;
