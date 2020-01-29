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
module.exports = router;
