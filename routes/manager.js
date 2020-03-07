const express = require("express");
const router = express.Router();
const passport = require("passport");
const middle = require("../routes/middle");
const User = require("../model/user");

router.get("/", async (req, res) => {
  let user = req.session.passport.user;
  res.render("manager_match", {
    title: "퍼즐풋볼-매니저",
    user: user
  });
});
module.exports = router;
