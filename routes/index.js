const express = require("express");
const router = express.Router();
const Match = require("../model/match");
const Ground = require("../model/ground");
const Region = require("../model/region");
const Notice = require("../model/notice");
const mongoose = require("mongoose");

/* GET home page. */
router.get("/", async (req, res) => {
  let today = new Date();
  let list = await fnGetMatchList(today.toISOString().slice(0, 10), req.query);
  let user_info = req.session.passport;
  let ground_list = await Ground.find({}, { groundName: 1 });
  let region = await Region.find({});
  let notice_list = await Notice.find({ activity: true });
  let region_group = await Region.aggregate([
    { $match: {} },
    {
      $lookup: {
        from: "ground",
        localField: "_id",
        foreignField: "region",
        as: "info"
      }
    },
    { $unwind: "$info" },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        list: { $push: "$info" }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  res.render("index", {
    list: list,
    user_info: user_info,
    ground_list: ground_list,
    region: region,
    query: req.query,
    region_group: region_group,
    notice_list: notice_list
  });
});
router.get("/search", async (req, res) => {
  let user_info = req.session.passport;
  let query = req.query;
  res.render("index", {
    user_info: user_info
  });
});
router.get("/schedule/:date", async (req, res) => {
  let list = await fnGetMatchList(req.params.date, req.query);
  res.json(list);
});
// 경기 일정 가져오는 함수
async function fnGetMatchList(date, query) {
  let match_query = {};
  match_query["match_date"] = date;
  if (query.game_type) match_query["match_type"] = query.game_type;
  if (query.ground_id)
    match_query["ground_id"] = mongoose.Types.ObjectId(query.ground_id);
  if (query.ground) {
    let in_query = query.ground.split(",").map(v => {
      return mongoose.Types.ObjectId(v);
    });
    match_query["ground_id"] = { $in: in_query };
  }
  let result = await Match.aggregate([
    { $match: match_query },
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
  return result;
}
module.exports = router;
