document.addEventListener("DOMContentLoaded", function () {
	$("#matchTime1").datetimepicker({
		format: "HH:mm", //use this format if you want the 12hours timpiecker with AM/PM toggle
		icons: {
			time: "fa fa-clock-o",
			date: "fa fa-calendar",
			up: "fa fa-chevron-up",
			down: "fa fa-chevron-down",
			previous: "fa fa-chevron-left",
			next: "fa fa-chevron-right",
			today: "fa fa-screenshot",
			clear: "fa fa-trash",
			close: "fa fa-remove",
		},
		stepping: 30,
	});
	$("#matchTime2").datetimepicker({
		format: "HH:mm", //use this format if you want the 12hours timpiecker with AM/PM toggle
		icons: {
			time: "fa fa-clock-o",
			date: "fa fa-calendar",
			up: "fa fa-chevron-up",
			down: "fa fa-chevron-down",
			previous: "fa fa-chevron-left",
			next: "fa fa-chevron-right",
			today: "fa fa-screenshot",
			clear: "fa fa-trash",
			close: "fa fa-remove",
		},
		stepping: 30,
	});
	$("#matchBegin").datetimepicker({
		format: "YYYY-MM-DD",
		icons: {
			time: "fa fa-clock-o",
			date: "fa fa-calendar",
			up: "fa fa-chevron-up",
			down: "fa fa-chevron-down",
			previous: "fa fa-chevron-left",
			next: "fa fa-chevron-right",
			today: "fa fa-screenshot",
			clear: "fa fa-trash",
			close: "fa fa-remove",
		},
		stepping: 30,
	});
});

document.querySelector('select[name="league_region"]').addEventListener("change", function () {
	let region_id = this.value;
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "/admin/league/ground/" + region_id, true);
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			if (res.code === 1) {
				let list = res.list[0].ground_info;
				let select = document.querySelector('select[name="league_ground"]');
				let option;
				select.innerHTML = "";
				if (list.length > 0) {
					list.forEach(function (v) {
						option = document.createElement("option");
						option.value = v._id;
						option.innerText = v.groundName;
						select.appendChild(option);
					});
				} else {
					option = document.createElement("option");
					option.value = "";
					option.innerText = "등록된 구장이 없습니다.";
					select.appendChild(option);
				}
			}
		}
	};
	xhr.send();
});
// 리그 등록/수정
const fnSubmit = function (method) {
	let data = document.querySelectorAll("form[name='leagueForm'] [name]");
	let err = 0;
	let formData = {};
	let league_id = document.querySelector("input[name='league_id']").value;
	data.forEach(function (v) {
		if (v.value === "") {
			v.parentNode.className = "form-group has-danger";
			err++;
		} else {
			formData[v.name] = v.value;
			v.parentNode.className = "form-group";
		}
	});
	if (err > 0) return false;
	let xhr = new XMLHttpRequest();
	xhr.open(method, "/admin/league/register" + method === "put" ? "/" + league_id : "", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			alert(res.message);
			if (res.code === 1) location.href = "/admin/league";
		}
	};
	xhr.send(JSON.stringify(formData));
	return false;
};
// 팀정보 상세 보기 팝업
document.querySelectorAll('button[data-role="showDetail"]').forEach(function (btn) {
	btn.addEventListener("click", function () {
		let team_id = this.dataset.id;
		let xhr = new XMLHttpRequest();
		xhr.open("GET", "/admin/club/detail/" + team_id, true);
		xhr.onreadystatechange = function () {
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				let res = JSON.parse(this.response);
				if (res.code === 1) {
					let doc = res.doc[0];
					let user_list = doc.user_info;
					// 팀 기본 정보
					document.querySelector("#team_name").innerText = doc.club_name;
					document.querySelector("#team_desc").innerText = doc.club_desc;
					["team_email", "team_phone", "team_gender", "uniform_top", "uniform_bottom"].forEach(
						function (v) {
							document.querySelector('input[name="' + v + '"]').value =
								v === "team_gender" ? (doc[v] === "male" ? "남성" : "여성") : doc[v];
						}
					);
					// 유저 리스트
					let userTable = document.querySelector("#userTable");
					let tr, td;
					userTable.innerHTML = "";
					user_list.forEach(function (v, idx) {
						tr = document.createElement("tr");
						td = document.createElement("td");
						td.innerText = idx + 1;
						tr.appendChild(td);

						td = document.createElement("td");
						td.innerText = v.user_id;
						td.className = "text-left";
						tr.appendChild(td);

						td = document.createElement("td");
						td.innerText = v.user_name;
						td.className = "text-left";
						tr.appendChild(td);

						td = document.createElement("td");
						td.innerText = v.gender === "male" ? "남성" : "여성";
						tr.appendChild(td);

						td = document.createElement("td");
						td.innerText = v.height;
						tr.appendChild(td);

						td = document.createElement("td");
						td.innerText = v.weight;
						tr.appendChild(td);

						td = document.createElement("td");
						td.innerText = v.position;
						tr.appendChild(td);
						userTable.appendChild(tr);
					});
					$("#teamDetailModal").modal("show");
				} else {
					alert(res.message);
				}
			}
		};
		xhr.send();
	});
});
// 라운드 생성
const createRound = function (league_id) {
	let team_list = [];
	document.querySelectorAll("tr[data-id]").forEach(function (tr) {
		team_list.push(tr.dataset.id);
	});
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/admin/league/round/" + league_id, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			alert(res.message);
			if (res.code === 1) location.reload();
		}
	};
	let match_day_list = [];
	let match_day = new Date(document.querySelector('input[name="match_begin"]').value);
	match_day_list.push(match_day.setDate(match_day.getDate()));
	for (var i = 0; i < 6; i++) {
		match_day_list.push(match_day.setDate(match_day.getDate() + 7));
	}
	let formData = {};
	formData["team_list"] = team_list;
	formData["match_date"] = document.querySelector('select[name="match_date"]').value;
	formData["match_day_list"] = match_day_list;
	formData["match_time_1"] = document.querySelector('input[name="match_time_1"]').value;
	formData["match_time_2"] = document.querySelector('input[name="match_time_2"]').value;
	console.log("form data : ", formData);
	xhr.send(JSON.stringify(formData));
};
