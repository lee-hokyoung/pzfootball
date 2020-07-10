const express = require("express");
const router = express.Router();
const middle = require("../routes/middle");
const League = require("../model/league");
const Club = require("../model/club");
const helper = require("./helper");
const mongoose = require("mongoose");

//  리그 매치 화면
router.all("/", async (req, res) => {
	let user_info = req.session.passport;
	let league_region = await League.aggregate([
		{
			$lookup: {
				from: "regions",
				localField: "league_region",
				foreignField: "_id",
				as: "region_info",
			},
		},
		{ $unwind: "$region_info" },
		{ $group: { _id: "$region_info._id", name: { $first: "$region_info.name" } } },
	]);
	let league_info;
	if (req.method === "POST") {
		league_info = await League.findOne({
			league_region: mongoose.Types.ObjectId(req.body.league_region),
			league_type: req.body.league_type,
			season: req.body.league_season,
		});
	} else {
		league_info = await League.findOne({ active: true });
	}
	let round_info = await helper.round_info(league_info._id);
	res.render("league", {
		user_info: user_info,
		active: "league",
		league_region: league_region,
		body: req.body,
		round_info: round_info,
	});
});
// 지역, 리그 선택시 시즌 리스트 가져오기
router.get("/season/:region_id/:league_type", async (req, res) => {
	let season = await League.find(
		{
			league_region: mongoose.Types.ObjectId(req.params.region_id),
			league_type: req.params.league_type,
		},
		{ season: 1 }
	).sort({ season: 1 });
	res.json(season);
});
// 리그 신청 페이지
router.get("/request", middle.isSignedIn, async (req, res) => {
	let user_info = req.session.passport;
	let league_list = await League.aggregate([
		{ $match: {} },
		{
			$lookup: {
				from: "regions",
				localField: "league_region",
				foreignField: "_id",
				as: "region_info",
			},
		},
		{
			$lookup: {
				from: "ground",
				localField: "league_ground",
				foreignField: "_id",
				as: "ground_info",
			},
		},
		{
			$project: {
				league_title: 1,
				round_cnt: 1,
				team_cnt: 1,
				league_type: 1,
				season: 1,
				reward: 1,
				match_date: 1,
				match_time: 1,
				region_info: { name: 1 },
				ground_info: { groundName: 1 },
			},
		},
	]);
	res.render("league_request", {
		user_info: user_info,
		active: "league",
		league_list: league_list,
	});
});
// 리그 신청하기
router.post("/request", middle.isSignedIn, async (req, res) => {
	// 신청자가 주장이어야 함. 주장 혹은 공동주장 유무 확인
	let user_info = req.session.passport;
	let club = await Club.findOne({
		club_member: {
			$elemMatch: {
				_id: mongoose.Types.ObjectId(user_info.user._id),
				user_role: { $in: ["leader", "co-leader"] },
			},
		},
	});
	if (club) {
		// 이미 지원한 리그인지 확인
		let isExist = await League.findOne({
			_id: mongoose.Types.ObjectId(req.body.league_id),
			participate: mongoose.Types.ObjectId(club._id),
		});
		if (isExist) {
			return res.json({ code: 0, message: "이미 신청한 리그 입니다." });
		} else {
			await League.updateOne(
				{ _id: mongoose.Types.ObjectId(req.body.league_id) },
				{ $push: { participate: mongoose.Types.ObjectId(club._id) } }
			);
			return res.json({ code: 1, message: "정상적으로 신청되었습니다." });
		}
	} else {
		return res.json({ code: 0, message: "리그 지원은 주장 혹은 공동주장만 신청 가능합니다." });
	}
});
module.exports = router;
