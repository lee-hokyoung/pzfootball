const express = require("express");
const router = express.Router();
const User = require("../model/user");
const Club = require("../model/club");
const Match = require("../model/match");
const Region = require("../model/region");
const Ground = require("../model/ground");
const mongoose = require("mongoose");
router.get("/region_group", async (req, res) => {
  let region_group = await Region.aggregate([
    { $match: {} },
    {
      $lookup: {
        from: "ground",
        localField: "_id",
        foreignField: "region",
        as: "info",
      },
    },
    { $unwind: "$info" },
    {
      $project: {
        info: {
          ground_images: 0,
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        list: { $push: "$info" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.json(region_group);
});
router.get("/favorite", async (req, res) => {
  let d = new Date();
  let month = d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
  let date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
  let today = d.getFullYear() + "-" + month + "-" + date;
  let user_info = await User.findOne({ user_id: "kakao_1265876857" }, { favorite_ground: 1 });
  console.log("fa : ", user_info.favorite_ground);
  console.log("today : ", today);
  let new_ground = await Ground.aggregate([
    {
      $match: {
        $or: user_info.favorite_ground.map((v) => {
          return { _id: mongoose.Types.ObjectId(v) };
        }),
      },
    },
    {
      $project: {
        ground_images: 0,
      },
    },
    {
      $lookup: {
        from: "match",
        localField: "_id",
        foreignField: "ground_id",
        as: "match_info",
      },
    },
    { $unwind: { path: "$match_info", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$_id",
        groundName: { $first: "$groundName" },
        groundAddress: { $first: "$groundAddress" },
        count: { $sum: { $cond: [{ $gt: ["$match_info", null] }, 1, 0] } },
      },
    },
  ]);
  let ground = await Match.aggregate([
    {
      $match: {
        $and: [
          {
            $or: user_info.favorite_ground.map((v) => {
              return { ground_id: mongoose.Types.ObjectId(v) };
            }),
          },
          { match_date: { $gte: today } },
        ],
      },
    },
    {
      $lookup: {
        from: "ground",
        localField: "ground_id",
        foreignField: "_id",
        as: "ground_info",
      },
    },
    {
      $project: {
        ground_info: {
          _id: 1,
          groundName: 1,
          groundAddress: 1,
        },
      },
    },
    { $unwind: { path: "$ground_info", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$ground_info._id",
        groundName: { $first: "$ground_info.groundName" },
        groundAddress: { $first: "$ground_info.groundAddress" },
        cound: { $sum: 1 },
      },
    },
  ]);
  res.json(new_ground);
});
router.get("/admin_user", async (req, res) => {
  let list = await User.aggregate([
    { $match: { admin: false } },
    { $sort: { created_at: 1 } },
    {
      $project: {
        user_id: 1,
        user_name: 1,
        user_phone: 1,
        phone1: 1,
        phone2: 1,
        point: 1,
        manner: 1,
        created_at: 1,
      },
    },
    {
      $lookup: {
        from: "club",
        let: { local_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $gt: [{ $indexOfArray: ["$club_member", "$$local_id"] }, -1],
              },
            },
          },
          { $project: { club_mark: 0 } },
        ],
        as: "club_info",
      },
    },
    { $unwind: { path: "$club_info", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "club",
        let: { local_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $gt: [{ $indexOfArray: ["$waiting_member", "$$local_id"] }, -1],
              },
            },
          },
          { $project: { _id: 1 } },
        ],
        as: "waiting_info",
      },
    },
    {
      $unwind: {
        path: "$waiting_info",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "match",
        let: { local_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $gt: [{ $indexOfArray: ["$apply_member._id", "$$local_id"] }, -1],
              },
            },
          },
          { $project: { apply_member: 1, mvp: 1 } },
        ],
        as: "match_info",
      },
    },
    { $unwind: { path: "$match_info", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "manners",
        localField: "match_info.apply_member.penalty",
        foreignField: "_id",
        as: "manner_info",
      },
    },
    {
      $group: {
        _id: "$_id",
        user_id: { $first: "$user_id" },
        user_name: { $first: "$user_name" },
        user_phone: { $first: "$user_phone" },
        phone1: { $first: "$phone1" },
        phone2: { $first: "$phone2" },
        point: { $first: "$point" },
        club_info: { $first: "$club_info" },
        waiting_info: { $first: "$waiting_info" },
        created_at: { $first: "$created_at" },
        match_count: { $sum: 1 },
        match_data: { $push: "$match_info" },
        manner_info: { $push: "$manner_info" },
      },
    },
  ]);
  res.json(list);
});
router.get("/club_read/:id", async (req, res) => {
  let club = await Club.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(req.params.id) },
    },
    {
      $lookup: {
        from: "users",
        localField: "club_member._id",
        foreignField: "_id",
        as: "user_info",
      },
    },
    {
      $project: {
        user_info: {
          admin: 0,
          user_pw: 0,
          point: 0,
          created_at: 0,
          favorite_ground: 0,
          user_phone: 0,
          phone1: 0,
          phone2: 0,
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "waiting_member",
        foreignField: "_id",
        as: "waiting_info",
      },
    },
  ]);
  res.json(club);
});
module.exports = router;
