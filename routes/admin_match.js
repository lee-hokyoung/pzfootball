const express = require("express");
const router = express.Router();
const Match = require("../model/match");
const Ground = require("../model/ground");
const mongoose = require("mongoose");

router.get("/list", async (req, res) => {
  let user = req.session.passport.user;
  let list = await Match.aggregate([{ $match: {} }]);
  res.render("admin_match", {
    active: "match",
    title: "일정관리",
    user: user,
    list: list
  });
});
router.get("/register/:date?/:ground_id?", async (req, res) => {
  let d = new Date();
  let today = d.getFullYear() + "-" + d.getMonth() + 1 + "-" + d.getDate();
  let date = req.params.date || today;
  let ground_id = req.params.ground_id || "";
  let user = req.session.passport.user;
  let ground = await Ground.find({});
  let match_list = [];
  if (ground_id !== "") {
    match_list = await Match.aggregate([
      {
        $match: {
          ground_id: mongoose.Types.ObjectId(ground_id),
          match_date: new Date(date)
        }
      }
    ]);
  }

  res.render("admin_match_register", {
    active: "match",
    user: user,
    title: "일정등록",
    ground: ground,
    selectedDate: date,
    ground_id: ground_id,
    match_list: match_list
  });
});
router.post("/register", async (req, res) => {
  let result = await Match.create(req.body);
  res.json(result);
});

module.exports = router;
