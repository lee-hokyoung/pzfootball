const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 리그 스키마
const leagueSchema = new Schema({
	league_title: String,
	round_cnt: Number,
	team_cnt: Number,
	league_region: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },
	league_ground: { type: mongoose.Schema.Types.ObjectId, ref: "Ground" },
	league_type: String,
	active: { type: Boolean, default: false },
	season: String,
	reward: String,
	match_date: String, // 매치 요일
	match_begin: String, // 매치 시작일
	match_time_1: String,
	match_time_2: String,
	participate: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
	round_info: [
		{
			round_no: Number,
			match_no: String,
			game_no: Number,
			match_date: Number,
			match_day: Date,
			match_time: String,
			result: String,
			home_team: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
			away_team: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
		},
	],
	created_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model("League", leagueSchema, "league");
