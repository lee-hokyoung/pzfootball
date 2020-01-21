const express = require("express");
const router = express.Router();
const Match = require("../model/match");
const passport = require("passport");

/* GET home page. */
router.get("/", async (req, res, next) => {
  let list = await fnGetMatchList();
  console.log("user : ", req.session.passport);
  let user_info = req.session.passport;
  res.render("index", {
    list: list,
    user_info: user_info
  });
});

router.get("/schedule/:date", async (req, res) => {
  let list = await fnGetMatchList(req.params.date);
  res.json(list);
});
// 경기 일정 가져오는 함수
async function fnGetMatchList(date) {
  let today = new Date();
  let d = date || today.toISOString().slice(0, 10);
  let result = await Match.aggregate([
    { $match: { match_date: d } },
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
