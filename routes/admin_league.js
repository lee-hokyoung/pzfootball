const express = require("express");
const router = express.Router();
const Region = require("../model/region");

// 리그 대시보드
router.get("/", async (req, res) => {
	let user = req.session.passport.user;
	res.render("admin_league", {
		active: "league",
		title: "퍼즐풋볼 - 리그관리",
		user: user,
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
module.exports = router;
