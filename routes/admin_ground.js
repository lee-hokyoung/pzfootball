const express = require("express");
const router = express.Router();
const Ground = require("../model/ground");
const Region = require("../model/region");
const mongoose = require("mongoose");

// 경기장 리스트
router.get("/", async (req, res) => {
  let user = req.session.passport.user;
  let list = await Ground.aggregate([{ $match: {} }]);
  res.render("admin_ground", {
    active: "ground",
    user: user,
    list: list,
    title: "퍼즐풋볼 - 경기장 관리"
  });
});
// 경기장 읽기
router.get("/read/:id", async (req, res) => {
  let doc = await Ground.aggregate([
    { $match: { _id: req.params.id } },
    {
      $lookup: {
        from: "region",
        localField: "region_id",
        foreinFiedl: "_id",
        as: "region_info"
      }
    },
    { $unwind: "$region_info" }
  ]);
  res.json(doc);
});
// 경기장 수정 or 등록 화면
router.get("/register/:id?", async (req, res) => {
  let ground = null;
  let user = req.session.passport.user;
  let id = req.params.id;
  if (typeof id !== "undefined") {
    ground = await Ground.findOne({ _id: mongoose.Types.ObjectId(id) });
  }
  let region = await Region.find({});
  res.render("admin_ground_register", {
    active: "ground",
    title: "퍼즐풋볼 - 경기장 등록",
    user: user,
    ground: ground,
    region: region
  });
});
// 경기장 등록
router.post("/register", async (req, res) => {
  try {
    let insertDoc = {
      groundName: req.body.groundName,
      groundAddress: {
        jibun: req.body.jibun,
        road: req.body.road
      },
      ground_images: {
        ground_images_1: req.body.ground_images.ground_images_1 || "",
        ground_images_2: req.body.ground_images.ground_images_2 || "",
        ground_images_3: req.body.ground_images.ground_images_3 || ""
      },
      mapInfo: { Lat: Number(req.body.y), Lng: Number(req.body.x) },
      facility: {
        size: {
          x: Number(req.body.groundSizeX),
          y: Number(req.body.groundSizeY)
        },
        shower: req.body.facility.indexOf("shower") > -1,
        freeParking: req.body.facility.indexOf("freeParking") > -1,
        shoesRental: req.body.facility.indexOf("shoesRental") > -1,
        uniformRental: req.body.facility.indexOf("uniformRental") > -1
      },
      description: req.body.description,
      region: mongoose.Types.ObjectId(req.body.region)
    };
    // INSERT OR UPDATE
    let isUpdate = req.body.isUpdate,
      result;
    if (!isUpdate) result = await Ground.create(insertDoc);
    else
      result = await Ground.updateOne(
        { _id: req.body.ground_id },
        { $set: insertDoc }
      );

    if (result) {
      res.json({ code: 1, message: "등록성공", result: result });
    } else {
      res.json({ code: 0, message: "등록실패" });
    }
  } catch (e) {
    console.error(e);
    res.json({ code: 0, message: "등록실패!" });
  }
});

module.exports = router;
