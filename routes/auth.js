const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/kakao", passport.authenticate("kakao"));
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/" }),
  async (req, res) => {
    res.redirect("/");
  }
);
router.get("/naver", passport.authenticate("naver"));
router.get(
  "/naver/callback",
  passport.authenticate("naver", { failureRedirect: "/" }),
  async (req, res) => {
    res.redirect("/");
  }
);

//  매니저 관련 로그인 페이지로 이동
router.get("/manager", async (req, res) => {
  res.render("manager_login", {
    title: "퍼즐풋볼 - 매니저 로그인"
  });
});
module.exports = router;
