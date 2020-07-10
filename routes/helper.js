const League = require("../model/league");
const mongoose = require("mongoose");

exports.round_info = async (league_id) => {
	let result = await League.aggregate([
		{ $match: { _id: mongoose.Types.ObjectId(league_id) } },
		{ $unwind: "$round_info" },
		{
			$lookup: {
				from: "club",
				localField: "round_info.home_team",
				foreignField: "_id",
				as: "home_team",
			},
		},
		{
			$lookup: {
				from: "club",
				localField: "round_info.away_team",
				foreignField: "_id",
				as: "away_team",
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
		{ $unwind: "$home_team" },
		{ $unwind: "$away_team" },
		{ $unwind: "$ground_info" },
		{
			$group: {
				_id: {
					round_no: "$round_info.round_no",
					match_no: "$round_info.match_no",
					game_no: "$round_info.game_no",
				},
				round_no: { $first: "$round_info.round_no" },
				match_no: { $first: "$round_info.match_no" },
				game_no: { $first: "$round_info.game_no" },
				match_date: { $first: "$round_info.match_date" },
				match_day: { $first: "$round_info.match_day" },
				match_time: { $first: "$round_info.match_time" },
				ground_name: { $first: "$ground_info.groundName" },

				home_team: { $first: "$home_team" },
				away_team: { $first: "$away_team" },
				league_title: { $first: "$league_title" },
			},
		},
		{ $group: { _id: "$game_no", list: { $push: "$$ROOT" } } },
		{ $unwind: "$list" },
		{
			$group: {
				_id: { round_no: "$list._id.round_no" },
				list: { $push: "$list" },
			},
		},
		{ $unwind: "$list" },
		{ $sort: { "list.game_no": 1, "list.match_no": 1 } },
		{
			$group: {
				_id: "$_id.round_no",
				list: { $push: "$list" },
			},
		},
		{ $sort: { _id: 1 } },
	]);
	return result;
};
