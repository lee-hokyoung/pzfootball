const express = require("express");
const router = express.Router();
const Club = require("../model/club");
const mongoose = require("mongoose");

// 클럽 리스트 가져오기
router.get("/list", async (req, res) => {
	let user = req.session.passport.user;
	let club_list = await Club.aggregate([
		{ $match: {} },
		{
			$lookup: {
				from: "users",
				localField: "club_leader",
				foreignField: "_id",
				as: "leader_info",
			},
		},
		{ $unwind: "$leader_info" },
		{
			$lookup: {
				from: "regions",
				localField: "mainly_region",
				foreignField: "_id",
				as: "region_info",
			},
		},
		{ $unwind: "$region_info" },
	]);
	res.render("admin_club_list", {
		active: "club",
		user: user,
		club_list: club_list,
		title: "퍼즐풋볼 - 클럽관리",
	});
});
router.get("/detail/:team_id", async (req, res) => {
	try {
		let doc = await Club.aggregate([
			{ $match: { _id: mongoose.Types.ObjectId(req.params.team_id) } },
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
					club_desc: 1,
					club_name: 1,
					team_code: 1,
					team_email: 1,
					team_phone: 1,
					team_gender: 1,
					uniform_bottom: 1,
					uniform_top: 1,
					user_info: {
						gender: 1,
						height: 1,
						weight: 1,
						position: 1,
						skill: 1,
						user_id: 1,
						user_name: 1,
					},
				},
			},
		]);
		res.json({ code: 1, doc: doc });
	} catch (err) {
		res.json({ code: 0, message: err.message });
	}
});
//  클럽 삭제
router.delete("/:id", async (req, res) => {
	try {
		let result = await Club.deleteOne({ _id: req.params.id });
		res.json({ code: 1, message: "삭제 성공" });
	} catch (err) {
		console.error(err);
		res.json({ code: 0, message: "삭제 실패! 관리자에게 문의해 주세요" });
	}
});
//  팀 코드 중복 확인
router.get("/duplication/:team_code", async (req, res) => {
	try {
		let team_code = req.params.team_code + ".*";
		let exCode = await Club.find(
			{ team_code: { $regex: team_code, $options: "i" }, status: 1 },
			{ team_code: 1 }
		);
		res.json({ code: 1, exCode: exCode });
	} catch (err) {
		res.json({ code: 0, message: "확인 실패! 관리자에게 문의해 주세요" });
	}
});
//  클럽 코드 등록
router.put("/approval", async (req, res) => {
	try {
		//  등록 가능한 코드 확인
		let result = await Club.updateOne(
			{
				_id: mongoose.Types.ObjectId(req.body.club_id),
			},
			{ $set: { team_code: req.body.team_code, status: 1 } }
		);
		res.json({ code: 1, message: "승인되었습니다.", result: result });
	} catch (err) {
		res.json({ code: 0, message: err.message });
	}
});
module.exports = router;
