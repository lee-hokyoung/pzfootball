const express = require("express");
const router = express.Router();
const middle = require("../routes/middle");
const Match = require("../model/match");
const User = require("../model/user");
const mongoose = require("mongoose");

/* GET home page. */
router.get("/:id", middle.isSignedIn, async (req, res) => {
  let user_info = req.session.passport;
  let match_info = await Match.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
    {
      $lookup: {
        from: "ground",
        localField: "ground_id",
        foreignField: "_id",
        as: "ground_info",
      },
    },
    { $unwind: "$ground_info" },
  ]);
  res.render("match", {
    title: "퍼즐풋볼 - 매치",
    match_info: match_info[0],
    user_info: user_info,
  });
});

module.exports = router;
