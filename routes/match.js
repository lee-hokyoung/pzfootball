const express = require("express");
const router = express.Router();
const Match = require("../model/match");
const mongoose = require("mongoose");

/* GET home page. */
router.get("/:id", async (req, res, next) => {
  let match_info = await Match.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
    {
      $lookup: {
        from: "ground",
        localField: "ground_id",
        foreignField: "_id",
        as: "ground_info"
      }
    },
    { $unwind: "$ground_info" }
  ]);
  res.render("match", {
    title: "퍼즐풋볼 - 매치",
    match_info: match_info
  });
});

module.exports = router;
