const express = require("express");
const router = express.Router();
const Match = require("../model/match");
const Ground = require("../model/ground");
const Region = require("../model/region");
const Notice = require("../model/notice");
const User = require("../model/user");
const mongoose = require("mongoose");

//  일반 필터링 (성별, 레벨, 매치형태, 매치인원, 지역)
const fnGetFilterQuery = (req) => {
	let filter_query = { $and: [] };
	let today = new Date();
	//  성별 필터링
	if (req.body.gender) {
		filter_query["$and"].push({
			$or: req.body.gender.map((v) => {
				return { sex: v };
			}),
		});
	}
	//  능력 필터링
	if (req.body.skill) {
		filter_query["$and"].push({
			$or: req.body.skill.map((v) => {
				return { match_grade: v };
			}),
		});
	}
	//  매치 타입(2파, 3파) 필터링
	if (req.body.match_type) {
		filter_query["$and"].push({
			$or: req.body.match_type.map((v) => {
				return { match_type: v };
			}),
		});
	}
	//  매치 형태(5vs5, 6vs6) 필터링
	if (req.body.match_vs) {
		filter_query["$and"].push({
			$or: req.body.match_vs.map((v) => {
				return { match_vs: v };
			}),
		});
	}
	//  날짜 필터링
	if (req.body.match_date) {
		filter_query["$and"].push({ match_date: req.body.match_date });
	} else {
		let year = today.getFullYear();
		let month = today.getMonth() < 10 ? "0" + (today.getMonth() + 1) : today.getMonth();
		let _date = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
		filter_query["$and"].push({ match_date: year + "-" + month + "-" + _date });
	}
	//  필터가 없을 경우
	if (filter_query["$and"].length === 0) {
		filter_query["$and"].push({});
	}
	return filter_query;
};
//  지역 필터링
const fnGetRegionFilter = (req) => {
	let region_query = { $or: [] };
	//  지역 필터링 ground_info lookup 생성 후 필터가 돼야 하므로 ground_info.region 으로 매칭해야 함.
	if (req.body.region) {
		region_query["$or"].push({
			$or: req.body.region.map((v) => {
				return { "ground_info.region": mongoose.Types.ObjectId(v.toString()) };
			}),
		});
		// req.body.region.split(",").forEach((v) => {
		//   region_query["$or"].push({
		//     "ground_info.region": mongoose.Types.ObjectId(v.toString()),
		//   });
		// });
	} else {
		region_query["$or"].push({});
	}
	return region_query;
};
//  경기장 필터링
const fnGetGroundFilter = (req) => {
	let ground_query = { $or: [] };
	if (req.body.ground) {
		req.body.ground.split(",").forEach((v) => {
			ground_query["$or"].push({
				"ground_info._id": mongoose.Types.ObjectId(v.toString()),
			});
		});
	} else {
		ground_query["$or"].push({});
	}
	return ground_query;
};

/*  일반 접속의 경우, ladder = 0(일반 리그) 로 정함. */
router.get("/", async (req, res) => {
	let today = new Date();
	let year = today.getFullYear();
	let month = today.getMonth() < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
	let days = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
	let date = year + "-" + month + "-" + days;

	let user_info = req.session.passport;
	//  유저 로그인 확인 후, 즐겨찾기 등록된 구장이 있으면 리다이렉트 시킨다.
	let user = { favorite_ground: [] };
	if (user_info) {
		//  매니저로 로그인 됐을 경우, 자동 로그아웃 시키고 유저 로그인이 되게 한다.
		if (user_info.user.isManager) {
			let script = `<script>alert("매니저 권한으로 로그인 했습니다. 일반 유저로 로그인해주세요"); location.href='/';</script>`;
			req.logout();
			req.session.destroy();
			return res.send(script);
		}
		user = await User.findOne(
			{
				_id: mongoose.Types.ObjectId(user_info.user._id),
			},
			{ favorite_ground: 1 }
		);
		if (user.favorite_ground.length > 0 && !req.query.ground) {
			return res.redirect("/?ground=" + user.favorite_ground.join(","));
		}
	}

	let list = await fnGetMatchList(date, req.query, user_info);
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
	res.render("index", {
		list: list,
		user_info: user_info,
		ground_list: ground_list,
		region: region,
		query: req.query,
		region_group: region_group,
		notice_list: notice_list,
		favorite_ground: user.favorite_ground.join(","),
		active: "normal",
		body: null,
	});
});
router.get("/search", async (req, res) => {
	let user_info = req.session.passport;
	let query = req.query;
	res.render("index", {
		user_info: user_info,
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
	if (query.ground_id) match_query["ground_id"] = mongoose.Types.ObjectId(query.ground_id);
	//  지역으로 필터링 할 경우, 지역 내 구장 아이디를 가져온다
	if (query.region) {
		let ground_list = await Ground.aggregate([
			{
				$match: {
					region: {
						$in: query.region.split(",").map((v) => {
							return mongoose.Types.ObjectId(v);
						}),
					},
				},
			},
			{ $project: { _id: 1, groundName: 1 } },
		]);
		match_query["ground_id"] = {
			$in: ground_list.map((v) => {
				return mongoose.Types.ObjectId(v._id);
			}),
		};
	}
	//  구장으로 필터링(로그인 상태일 때만 가능함)
	if (query.ground && user_info) {
		let in_query = query.ground.split(",").map((v) => {
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
				as: "ground_info",
			},
		},
		{ $unwind: "$ground_info" },
		{ $project: { "ground_info.ground_images": 0 } },
		{ $sort: { match_time: 1 } },
	]);
	return result;
}
//  구장별 조회 화면
router.get("/ground/:id", async (req, res) => {
	let date = new Date();
	let user_info = req.session.passport;
	let today = date.toISOString().slice(0, 10);
	let ground_info = await Ground.findOne({
		_id: mongoose.Types.ObjectId(req.params.id),
	});
	let match_list = await Match.aggregate([
		{
			$match: {
				ground_id: mongoose.Types.ObjectId(req.params.id),
				match_date: { $gte: today },
			},
		},
		{
			$group: {
				_id: "$match_date",
				list: { $push: "$$ROOT" },
			},
		},
		// {
		//   $lookup: {
		//     from: "ground",
		//     localField: "ground_id",
		//     foreignField: "_id",
		//     as: "ground_info",
		//   },
		// },
		// { $unwind: "$ground_info" },
	]);
	res.render("ground_match_list", {
		match_list: match_list,
		ground_info: ground_info,
		user_info: user_info,
	});
});
//  구장 필터링
router.post("/filter", async (req, res) => {
	let user_info = req.session.passport;
	let filter_query = fnGetFilterQuery(req);
	let region_query = fnGetRegionFilter(req);
	let ground_query = fnGetGroundFilter(req);

	//  경기 일정 리스트
	let list = await Match.aggregate([
		{ $match: filter_query },
		{
			$lookup: {
				from: "ground",
				foreignField: "_id",
				localField: "ground_id",
				as: "ground_info",
			},
		},
		{ $unwind: "$ground_info" },
		{ $project: { "ground_info.ground_images": 0 } },
		{ $match: region_query },
		{ $match: ground_query },
	]);

	//  비동기 방식일 경우,
	if (req.body.XHR) {
		return res.json({ list: list, body: req.body });
	}
	//  비동기 방식이 아닌 경우
	else {
		//  그 외 기본 필요한 요소
		let favorite_ground;
		if (user_info) {
			favorite_ground = await User.findOne(
				{
					_id: mongoose.Types.ObjectId(user_info.user._id),
				},
				{ favorite_ground: 1 }
			);
		}
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
					as: "info",
				},
			},
			{ $unwind: "$info" },
			{
				$group: {
					_id: "$_id",
					name: { $first: "$name" },
					list: { $push: "$info" },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		return res.render("index", {
			list: list,
			user_info: user_info,
			ground_list: ground_list,
			region: region,
			region_group: region_group,
			notice_list: notice_list,
			body: req.body,
			query: req.query,
			filter_query: filter_query,
			favorite_ground: favorite_ground,
		});
	}
});
module.exports = router;
