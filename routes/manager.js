const express = require("express");
const router = express.Router();
const passport = require("passport");
const middle = require("../routes/middle");
const User = require("../model/user");

router.get("/", async (req, res) => {
  let user = req.session.passport.user;
  res.render("manager_dashboard", {
    title: "퍼즐풋볼 - 대시보드",
    user: user,
    active: "dashboard"
  });
});
router.get("/match", async (req, res) => {
  let user = req.session.passport.user;
  res.render("manager_match", {
    title: "퍼즐풋볼 - 경기일정 관리",
    active: "match",
    user: user
  });
});
router.post("/manager", middle.isNotLoggedIn, async (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
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
