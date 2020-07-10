const express = require("express");
const router = express.Router();
const Region = require("../model/region");
const Ground = require("../model/ground");
const League = require("../model/league");
const mongoose = require("mongoose");
const helper = require("./helper");

// 리그 대시보드
router.get("/", async (req, res) => {
	let user = req.session.passport.user;
	let list = await League.aggregate([
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
				match_time_1: 1,
				match_time_2: 1,
				participate: 1,
				region_info: { name: 1 },
				ground_info: { groundName: 1 },
			},
		},
	]);
	res.render("admin_league", {
		active: "league",
		title: "퍼즐풋볼 - 리그관리",
		user: user,
		list: list,
	});
});
// 리그 생성 페이지
router.get("/register", async (req, res) => {
	let user = req.session.passport.user;
	let region = await Region.find({});
	res.render("admin_league_register", {
		active: "league",
		title: "퍼즐풋볼 - 리그관리",
		region: region,
		user: user,
	});
});
// 리그 생성
router.post("/register", async (req, res) => {
	try {
		let isExist = await League.findOne({
			league_region: req.body.league_region,
			league_type: req.body.league_type,
			season: req.body.season,
		});
		if (isExist) {
			res.json({ code: 0, message: "동일한 리그가 존재합니다." });
		} else {
			await League.create(req.body);
			res.json({
				code: 1,
				message: "정상적으로 등록되었습니다.",
			});
		}
	} catch (err) {
		res.json({ code: 0, message: "등록 실패! 관리자에게 문의해 주세요" });
	}
});
// 리그 확인 페이지
router.get("/register/:league_id", async (req, res) => {
	let user = req.session.passport.user;
	let doc = await League.aggregate([
		{ $match: { _id: mongoose.Types.ObjectId(req.params.league_id) } },
		{ $lookup: { from: "club", localField: "participate", foreignField: "_id", as: "club_list" } },
	]);
	let round_info = await helper.round_info(req.params.league_id);
	let ground_list = await Ground.find({ region: mongoose.Types.ObjectId(doc[0].league_region) });
	let region = await Region.find({});
	res.render("admin_league_register", {
		active: "league",
		title: "퍼즐풋볼 - 리그관리",
		region: region,
		user: user,
		doc: doc[0],
		ground_list: ground_list,
		round_info: round_info,
	});
});
// 리그 수정
router.put("/register/:league_id", async (req, res) => {
	try {
		await League.updateOne(
			{
				_id: mongoose.Types.ObjectId(req.params.league_id),
				// league_region: req.body.league_region,
				// league_type: req.body.league_type,
				// season: req.body.season,
			},
			{ $set: req.body }
		);
		res.json({
			code: 1,
			message: "정상적으로 수정되었습니다.",
		});
	} catch (err) {
		res.json({ code: 0, message: "등록 실패! 관리자에게 문의해 주세요" });
	}
});
// 리그 삭제
router.delete("/:league_id", async (req, res) => {
	try {
		await League.deleteOne({ _id: mongoose.Types.ObjectId(req.params.league_id) });
		res.json({ code: 1, message: "정상적으로 삭제되었습니다." });
	} catch (err) {
		res.json({ code: 0, message: "삭제 실패! 관리자에게 문의해 주세요" });
	}
});
// 지역별 그라운드 추출
router.get("/ground/:region_id", async (req, res) => {
	try {
		let ground_list = await Region.aggregate([
			{ $match: { _id: mongoose.Types.ObjectId(req.params.region_id) } },
			{
				$lookup: {
					from: "ground",
					localField: "_id",
					foreignField: "region",
					as: "ground_info",
				},
			},
			{ $project: { ground_info: { _id: 1, groundName: 1 } } },
		]);
		res.json({ code: 1, list: ground_list });
	} catch (err) {
		res.json({ code: 0, message: err.message });
	}
});
// 라운드 생성
router.post("/round/:league_id", async (req, res) => {
	try {
		let team = req.body.team_list;
		let match_day_list = req.body.match_day_list;
		let round_info = [
			{
				round_no: 1,
				match_no: "A",
				game_no: 1,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[0]),
				match_time: req.body.match_time_1,
				home_team: mongoose.Types.ObjectId(team[0]),
				away_team: mongoose.Types.ObjectId(team[4]),
			},
			{
				round_no: 1,
				match_no: "A",
				game_no: 2,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[0]),
				match_time: req.body.match_time_2,
				home_team: mongoose.Types.ObjectId(team[2]),
				away_team: mongoose.Types.ObjectId(team[6]),
			},
			{
				round_no: 1,
				match_no: "B",
				game_no: 1,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[0]),
				match_time: req.body.match_time_1,
				home_team: mongoose.Types.ObjectId(team[1]),
				away_team: mongoose.Types.ObjectId(team[5]),
			},
			{
				round_no: 1,
				match_no: "B",
				game_no: 2,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[0]),
				match_time: req.body.match_time_2,
				home_team: mongoose.Types.ObjectId(team[3]),
				away_team: mongoose.Types.ObjectId(team[7]),
			},

			{
				round_no: 2,
				match_no: "A",
				game_no: 1,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[1]),
				match_time: req.body.match_time_1,
				home_team: mongoose.Types.ObjectId(team[5]),
				away_team: mongoose.Types.ObjectId(team[7]),
			},
			{
				round_no: 2,
				match_no: "A",
				game_no: 2,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[1]),
				match_time: req.body.match_time_2,
				home_team: mongoose.Types.ObjectId(team[1]),
				away_team: mongoose.Types.ObjectId(team[3]),
			},
			{
				round_no: 2,
				match_no: "B",
				game_no: 1,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[1]),
				match_time: req.body.match_time_1,
				home_team: mongoose.Types.ObjectId(team[0]),
				away_team: mongoose.Types.ObjectId(team[2]),
			},
			{
				round_no: 2,
				match_no: "B",
				game_no: 2,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[1]),
				match_time: req.body.match_time_2,
				home_team: mongoose.Types.ObjectId(team[4]),
				away_team: mongoose.Types.ObjectId(team[6]),
			},

			{
				round_no: 3,
				match_no: "A",
				game_no: 1,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[2]),
				match_time: req.body.match_time_1,
				home_team: mongoose.Types.ObjectId(team[2]),
				away_team: mongoose.Types.ObjectId(team[4]),
			},
			{
				round_no: 3,
				match_no: "A",
				game_no: 2,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[2]),
				match_time: req.body.match_time_2,
				home_team: mongoose.Types.ObjectId(team[0]),
				away_team: mongoose.Types.ObjectId(team[6]),
			},
			{
				round_no: 3,
				match_no: "B",
				game_no: 1,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[2]),
				match_time: req.body.match_time_1,
				home_team: mongoose.Types.ObjectId(team[3]),
				away_team: mongoose.Types.ObjectId(team[5]),
			},
			{
				round_no: 3,
				match_no: "B",
				game_no: 2,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[2]),
				match_time: req.body.match_time_2,
				home_team: mongoose.Types.ObjectId(team[1]),
				away_team: mongoose.Types.ObjectId(team[7]),
			},

			{
				round_no: 4,
				match_no: "A",
				game_no: 1,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[3]),
				match_time: req.body.match_time_1,
				home_team: mongoose.Types.ObjectId(team[1]),
				away_team: mongoose.Types.ObjectId(team[6]),
			},
			{
				round_no: 4,
				match_no: "A",
				game_no: 2,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[3]),
				match_time: req.body.match_time_2,
				home_team: mongoose.Types.ObjectId(team[3]),
				away_team: mongoose.Types.ObjectId(team[4]),
			},
			{
				round_no: 4,
				match_no: "B",
				game_no: 1,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[3]),
				match_time: req.body.match_time_1,
				home_team: mongoose.Types.ObjectId(team[2]),
				away_team: mongoose.Types.ObjectId(team[7]),
			},
			{
				round_no: 4,
				match_no: "B",
				game_no: 2,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[3]),
				match_time: req.body.match_time_2,
				home_team: mongoose.Types.ObjectId(team[0]),
				away_team: mongoose.Types.ObjectId(team[5]),
			},

			{
				round_no: 5,
				match_no: "A",
				game_no: 1,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[4]),
				match_time: req.body.match_time_1,
				home_team: mongoose.Types.ObjectId(team[0]),
				away_team: mongoose.Types.ObjectId(team[3]),
			},
			{
				round_no: 5,
				match_no: "A",
				game_no: 2,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[4]),
				match_time: req.body.match_time_2,
				home_team: mongoose.Types.ObjectId(team[1]),
				away_team: mongoose.Types.ObjectId(team[2]),
			},
			{
				round_no: 5,
				match_no: "B",
				game_no: 1,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[4]),
				match_time: req.body.match_time_1,
				home_team: mongoose.Types.ObjectId(team[4]),
				away_team: mongoose.Types.ObjectId(team[7]),
			},
			{
				round_no: 5,
				match_no: "B",
				game_no: 2,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[4]),
				match_time: req.body.match_time_2,
				home_team: mongoose.Types.ObjectId(team[5]),
				away_team: mongoose.Types.ObjectId(team[6]),
			},

			{
				round_no: 6,
				match_no: "A",
				game_no: 1,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[5]),
				match_time: req.body.match_time_1,
				home_team: mongoose.Types.ObjectId(team[6]),
				away_team: mongoose.Types.ObjectId(team[7]),
			},
			{
				round_no: 6,
				match_no: "A",
				game_no: 2,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[5]),
				match_time: req.body.match_time_2,
				home_team: mongoose.Types.ObjectId(team[4]),
				away_team: mongoose.Types.ObjectId(team[5]),
			},
			{
				round_no: 6,
				match_no: "B",
				game_no: 1,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[5]),
				match_time: req.body.match_time_1,
				home_team: mongoose.Types.ObjectId(team[0]),
				away_team: mongoose.Types.ObjectId(team[1]),
			},
			{
				round_no: 6,
				match_no: "B",
				game_no: 2,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[5]),
				match_time: req.body.match_time_2,
				home_team: mongoose.Types.ObjectId(team[2]),
				away_team: mongoose.Types.ObjectId(team[3]),
			},

			{
				round_no: 7,
				match_no: "A",
				game_no: 1,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[6]),
				match_time: req.body.match_time_1,
				home_team: mongoose.Types.ObjectId(team[2]),
				away_team: mongoose.Types.ObjectId(team[5]),
			},
			{
				round_no: 7,
				match_no: "A",
				game_no: 2,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[6]),
				match_time: req.body.match_time_2,
				home_team: mongoose.Types.ObjectId(team[0]),
				away_team: mongoose.Types.ObjectId(team[7]),
			},
			{
				round_no: 7,
				match_no: "B",
				game_no: 1,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[6]),
				match_time: req.body.match_time_1,
				home_team: mongoose.Types.ObjectId(team[3]),
				away_team: mongoose.Types.ObjectId(team[6]),
			},
			{
				round_no: 7,
				match_no: "B",
				game_no: 2,
				match_date: req.body.match_date,
				match_day: new Date(match_day_list[6]),
				match_time: req.body.match_time_2,
				home_team: mongoose.Types.ObjectId(team[1]),
				away_team: mongoose.Types.ObjectId(team[4]),
			},
		];
		await League.updateOne(
			{ _id: mongoose.Types.ObjectId(req.params.league_id) },
			{ $set: { round_info: round_info, active: true } }
		);
		res.json({ code: 1, message: "정상적으로 생성되었습니다." });
	} catch (err) {
		res.json({ code: 0, message: err.message });
	}
});
module.exports = router;
