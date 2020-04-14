const express = require("express");
const router = express.Router();
const passport = require("passport");
const middle = require("../routes/middle");
const mongoose = require("mongoose");
const User = require("../model/user");

const connect = () => {
  mongoose.connect(
    "mongodb://localhost:27017/pzfutball",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    async (error) => {
      if (error) console.log("몽고디비 연결 에러", error);
      else {
        console.log("몽고디비 연결 성공");
        let list = await User.aggregate([
          { $match: {} },
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
                      $gt: [
                        { $indexOfArray: ["$club_member", "$$local_id"] },
                        -1,
                      ],
                    },
                  },
                },
                { $project: { _id: 1 } },
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
                      $gt: [
                        { $indexOfArray: ["$waiting_member", "$$local_id"] },
                        -1,
                      ],
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
                      $gt: [
                        { $indexOfArray: ["$apply_member._id", "$$local_id"] },
                        -1,
                      ],
                    },
                  },
                },
                { $project: { _id: 1, apply_member: 1 } },
              ],
              as: "match_info",
            },
          },
          // {
          //   $project: {
          //     _id: 1,
          //     manner: 1,
          //     point: 1,
          //     user_id: 1,
          //     user_name: 1,
          //     user_phone: 1,
          //     phone1: 1,
          //     phone2: 1,
          //     created_at: 1,
          //     match_count: { $size: "$match_info" },
          //   },
          // },
        ]);
      }
    }
  );
};
connect();
