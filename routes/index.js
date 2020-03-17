const express = require("express");
const router = express.Router();
const Match = require("../model/match");
const Ground = require("../model/ground");
const Region = require("../model/region");
const Notice = require("../model/notice");
const User = require("../model/user");
const mongoose = require("mongoose");

/* GET home page. */
router.get("/", async (req, res) => {
  let today = new Date();
  let user_info = req.session.passport;

  //  유저 로그인 확인 후, 즐겨찾기 등록된 구장이 있으면 리다이렉트 시킨다.
  let user = { favorite_ground: [] };
  if (user_info) {
    user = await User.findOne(
      {
        _id: mongoose.Types.ObjectId(user_info.user._id)
      },
      { favorite_ground: 1 }
    );
    if (user.favorite_ground.length > 0 && !req.query.ground) {
      return res.redirect("/?ground=" + user.favorite_ground.join(","));
    }
  }

  let list = await fnGetMatchList(
    today.toISOString().slice(0, 10),
    req.query,
    user_info
  );
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
    notice_list: notice_list,
    favorite_ground: user.favorite_ground
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
  let user_info = req.session.passport;
  let list = await fnGetMatchList(req.params.date, req.query, user_info);
  res.json(list);
});
// 경기 일정 가져오는 함수
async function fnGetMatchList(date, query, user_info) {
  let match_query = {};
  match_query["match_date"] = date;
  if (query.game_type) match_query["match_type"] = query.game_type;
  if (query.ladder) match_query["ladder"] = parseInt(query.ladder);
  if (query.ground_id)
    match_query["ground_id"] = mongoose.Types.ObjectId(query.ground_id);
  //  지역으로 필터링 할 경우, 지역 내 구장 아이디를 가져온다
  if (query.region) {
    let ground_list = await Ground.aggregate([
      {
        $match: {
          region: {
            $in: query.region.split(",").map(v => {
              return mongoose.Types.ObjectId(v);
            })
          }
        }
      },
      { $project: { _id: 1, groundName: 1 } }
    ]);
    match_query["ground_id"] = {
      $in: ground_list.map(v => {
        return mongoose.Types.ObjectId(v._id);
      })
    };
  }
  //  구장으로 필터링(로그인 상태일 때만 가능함)
  if (query.ground && user_info) {
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
