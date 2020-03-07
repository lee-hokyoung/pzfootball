const express = require("express");
const router = express.Router();
const passport = require("passport");
const middle = require("../routes/middle");
const Manager = require("../model/manager");

router.get("/", middle.isManager, async (req, res) => {
  let user = req.session.passport.user;
  let manager_info = await Manager.findOne();
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

//  매니저 로그인
router.post("/login", middle.isNotLoggedInByManger, async (req, res, next) => {
  passport.authenticate("manager", (authError, user, info) => {
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
//  매니저 로그아웃
router.get("/logout", middle.isLoggedInByManager, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/auth/manager");
});
module.exports = router;
