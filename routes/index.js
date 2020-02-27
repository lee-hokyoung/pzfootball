const express = require("express");
const router = express.Router();
const Match = require("../model/match");
const Ground = require("../model/ground");
const passport = require("passport");

/* GET home page. */
router.get("/", async (req, res, next) => {
  let today = new Date();
  let list = await fnGetMatchList(today.toISOString().slice(0, 10), req.query);
  let user_info = req.session.passport;
  let ground_list = await Ground.find({}, { groundName: 1 });
  res.render("index", {
    list: list,
    user_info: user_info,
    ground_list: ground_list
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
  // let today = new Date();
  // let d = date || today.toISOString().slice(0, 10);
  console.log("query : ", query);
  let result = await Match.aggregate([
    { $match: { match_date: date } },
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
