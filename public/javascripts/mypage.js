document.addEventListener("DOMContentLoaded", function () {
	$('button[data-toggle="tooltip"]').tooltip();
});
//  클럽 가입
function fnJoinClub(team_id) {
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/clubs/join", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			alert(res.message);
			if (res.code === 1) {
				location.reload();
			}
		}
	};
	xhr.send(JSON.stringify({ _id: team_id }));
}

//  클럽 가입 취소
function fnCancelJoin() {
	if (!confirm("가입을 취소하시겠습니까?")) return false;
	let xhr = new XMLHttpRequest();
	xhr.open("PATCH", "/clubs/cancelJoin", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			alert(res.message);
			if (res.code === 1) location.reload();
		}
	};
	xhr.send();
}

//  클럽 생성
function fnCreateClub() {
	//  1. 클럽 가입 여부 확인
	console.log("start async");
	let res = JSON.parse(fnCheckMyClub());
	console.log("resut : ", res);
	if (res.code === 1) {
		if (res.result) {
			alert("이미 가입한 클럽이 있습니다.");
			return false;
		} else {
			//  2. 클럽 생성 페이지로 이동
			location.href = "/clubs/create";
		}
	} else {
		alert(res.message);
		return false;
	}
}

//  클럽 가입 여부 확인
function fnCheckMyClub() {
	return new Promise(function (resolve, reject) {
		let xhr = new XMLHttpRequest();
		xhr.open("GET", "/users/myClub", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onload = function () {
			if (this.status >= 200 && this.status < 300) {
				resolve(xhr.response);
			} else {
				reject({
					status: this.status,
					statusText: xhr.statusText,
				});
			}
		};
		xhr.onerror = function () {
			reject({
				status: this.status,
				statusText: xhr.statusText,
			});
		};
		xhr.send();
	});
}

// 개인정보 수정
function fnSaveUserInfo() {
	let user_name = document.querySelector('input[name="user_name"]');
	let user_nickname = document.querySelector('input[name="user_nickname"]');
	let user_email = document.querySelector('input[name="user_email"]');
	if (user_name.value === "") {
		alert("이름을 입력해주세요");
		user_name.focus();
		return false;
	}
	if (user_nickname.value === "") {
		alert("닉네임을 입력해주세요");
		user_nickname.focus();
		return false;
	}
	if (user_email.value === "") {
		alert("이메일을 입력해주세요");
		user_email.focus();
		return false;
	}
	let formData = {};
	formData["user_name"] = user_name.value;
	formData["user_nickname"] = user_nickname.value;
	formData["user_email"] = user_email.value;

	let xhr = new XMLHttpRequest();
	xhr.open("PUT", "/users/mypage/user_info", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			alert(res.message);
			if (res.code === 1) location.reload();
		}
	};
	xhr.send(JSON.stringify(formData));
}

//  지역별 전체 버튼 클릭
document.querySelectorAll('button[data-role="all"]').forEach(function (btn) {
	btn.addEventListener("click", function () {
		console.log(this);
		let id = this.dataset.id;
		let parent = document.querySelector('.ground-wrap[data-id="' + id + '"]');
		let parent_toggle = this.dataset.toggle;
		this.dataset.toggle = parent_toggle === "false";
		if (this.dataset.toggle === "true") this.innerHTML = "전체선택";
		else this.innerHTML = "전체해제";
		parent.querySelectorAll("button.btn-round").forEach(function (btn) {
			btn.dataset.toggle = parent_toggle === "false";
		});
	});
});
//  구장별 버튼 클릭시 이벤트
document.querySelectorAll("button[data-role='ground']").forEach(function () {
	btn.addEventListener("click", function () {
		let toggle = this.dataset.toggle;
		this.dataset.toggle = toggle === "false";
	});
});
//  즐겨찾는 구장 전체 선택 / 해제
document.querySelector('input[name="chkAllGround"]').addEventListener("click", function () {
	let toggle = this.dataset.toggle;
	this.dataset.toggle = toggle === "false";
	document.querySelectorAll('input[name="ground-item"]').forEach(function (inp) {
		inp.checked = toggle === "false";
	});
});
//  즐겨찾는 구장 선택 삭제
document.querySelector('button[name="btnRemoveFavorite"]').addEventListener("click", function () {
	let checked_ground = document.querySelectorAll('input[name="ground-item"]:checked');
	if (checked_ground.length === 0) {
		alert("삭제할 구장을 선택해 주세요.");
		return false;
	}
	if (confirm("즐겨찾는 구장을 삭제하시겠습니까?")) {
		let chk_list = [];
		checked_ground.forEach(function (v) {
			chk_list.push(v.dataset.id);
		});
		let xhr = new XMLHttpRequest();
		xhr.open("DELETE", "/users/favorite", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				let res = JSON.parse(this.response);
				alert(res.message);
				if (res.code === 1) location.reload();
			}
		};
		xhr.send(JSON.stringify({ ground_id: chk_list }));
	}
});

//  내 구장 정보 설정 -> 현재 사용중이지 않음. 구버전
let saveGround = document.querySelector('button[data-role="saveGround"]');
if (saveGround) {
	saveGround.addEventListener("click", function () {
		let ground_list = [];
		document
			.querySelectorAll('button[data-role="ground"][data-toggle="true"]')
			.forEach(function (btn) {
				ground_list.push(btn.dataset.id);
			});
		let xhr = new XMLHttpRequest();
		xhr.open("PUT", "/users/region", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				let res = JSON.parse(this.response);
				alert(res.message);
				if (res.code === 1) location.reload();
			}
		};
		xhr.send(JSON.stringify({ ground: ground_list }));
	});
}

//  내 정보 편집 아이콘 클릭 이벤트(아이콘 토글)
document.querySelectorAll(".user-info-wrap tbody td button[data-role]").forEach(function (btn) {
	btn.addEventListener("click", function () {
		let td = btn.parentElement.parentElement;
		let input = td.querySelector("input");
		if (td.getAttribute("about") === "gender") {
			input = td.querySelector('input[type="radio"]:checked');
		} else if (td.getAttribute("about") === "user_phone") {
		}
		switch (this.dataset.role) {
			case "edit":
			case "cancel":
				td.querySelectorAll("div[data-toggle], input[data-toggle]").forEach(function (div) {
					let toggle = div.dataset.toggle;
					div.dataset.toggle = toggle === "false";
				});
				if (this.dataset.role === "edit") {
					input.removeAttribute("readonly");
				} else {
					input.setAttribute("readonly", "readonly");
				}
				break;
			case "confirm":
				let formData = {},
					multi_input;
				//  input이 여러개 있을 경우
				if (this.dataset.type === "multi") {
					multi_input = td.querySelectorAll(".d-flex input");
					multi_input.forEach(function (v) {
						formData[v.name] = v.value;
					});
				} else {
					formData[input.name] = input.value;
				}
				let xhr = new XMLHttpRequest();
				xhr.open("POST", "/users/mypage/myinfo", true);
				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.onreadystatechange = function () {
					if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
						let res = JSON.parse(this.response);
						if (res.code === 1) {
							input.setAttribute("readonly", "readonly");
							td.querySelectorAll("div[data-toggle], input[data-toggle]").forEach(function (div) {
								let toggle = div.dataset.toggle;
								div.dataset.toggle = toggle === "false";
							});
							if (input.name === "gender") {
								td.querySelector('input[name="gender"]').value =
									input.value === "male" ? "남자" : input.value === "female" ? "여자" : "선택안함";
							} else if (input.name === "user_phone") {
								input.value =
									multi_input[0].value + "-" + multi_input[1].value + "-" + multi_input[2].value;
							}
						}
					}
				};
				xhr.send(JSON.stringify(formData));
				break;
		}
	});
});
//  포지션, 실력 등 버튼 클릭시 정보 업데이트
document.querySelectorAll(".radio-button-wrap button").forEach(function (btn) {
	btn.addEventListener("click", function () {
		let wrap = this.parentElement;
		wrap.querySelectorAll("button").forEach(function (v) {
			v.className = "";
		});
		this.className = "active";
		let formData = {};
		formData[this.name] = this.value;
		let xhr = new XMLHttpRequest();
		xhr.open("POST", "/users/mypage/myinfo", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				let res = JSON.parse(this.response);
			}
		};
		xhr.send(JSON.stringify(formData));
	});
});

//  팀 코드 검색 결과 표시하기
function fnSearchTeam() {
	let team_code = document.querySelector('input[name="team_code"]');
	if (team_code.value === "") {
		alert("팀 코드를 입력해 주세요");
		team_code.focus();
	}
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "/clubs/find/" + team_code.value, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			let tbody = document.querySelector("#teamSearchTable tbody");
			tbody.innerHTML = "";
			if (res.code === 1) {
				if (res.result.length > 0) {
					let team_info = res.result[0];
					let tr = document.createElement("tr");
					let td = document.createElement("td");
					td.innerText = team_info.club_name;
					tr.appendChild(td);

					td = document.createElement("td");
					td.innerText = team_info.user_info.user_name;
					tr.appendChild(td);

					td = document.createElement("td");
					td.innerText = team_info.team_phone;
					tr.appendChild(td);

					td = document.createElement("td");
					let button = document.createElement("button");
					button.className = "btn btn-primary ml-3";
					button.innerText = "가입신청";
					button.addEventListener("click", function () {
						fnJoinClub(team_info._id);
					});
					td.appendChild(button);
					tr.appendChild(td);

					tbody.appendChild(tr);
				} else {
					let tr = document.createElement("tr");
					let td = document.createElement("td");
					td.className = "text-center";
					td.setAttribute("colspan", 4);
					td.innerText = "검색 결과가 없습니다.";
					tr.appendChild(td);
					tbody.appendChild(tr);
				}
			} else {
				alert(res.message);
			}
		}
	};
	xhr.send();
	return false;
}

//  환불 요청
function fnReqRefund() {
	let reqRefundPoint = document.querySelector('input[name="requestRefundPoint"]');
	if (reqRefundPoint.value === "") {
		alert("요청할 포인트를 입력해 주세요");
		return false;
	}
	let maxPoint = document.querySelector('input[name="inpRefund"]').value;
	if (parseInt(reqRefundPoint.value) > parseInt(maxPoint)) {
		alert("환불 신청 가능한 포인트는 " + new Intl.NumberFormat("ko").format(maxPoint) + "입니다.");
		return false;
	}
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/users/refund", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			console.log("res : ", res);
			alert(res.message);
			if (res.code === 1) location.reload();
		}
	};
	xhr.send(JSON.stringify({ reqRefundPoint: reqRefundPoint.value }));
}

//  예약 취소
document.querySelectorAll('button[data-role="cancelReservation"]').forEach(function (btn) {
	btn.addEventListener("click", function () {
		if (confirm("예약을 취소하시겠습니까?")) {
			let match_id = this.dataset.id;
			let xhr = new XMLHttpRequest();
			xhr.open("DELETE", "/users/reservation", true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.onreadystatechange = function () {
				if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
					let res = JSON.parse(this.response);
					alert(res.message);
					if (res.code === 1) location.reload();
				}
			};
			xhr.send(JSON.stringify({ match_id: match_id }));
		}
	});
});

//  프로필 사진 변경 이벤트
$('input[name="profile_image"]').on("change.bs.fileinput", function () {
	document.querySelector("button[name='profile_image']").dataset.view = "true";
});
document.querySelector('button[name="profile_image"]').addEventListener("click", function () {
	let profile_image = document.querySelector(".fileinput-preview img").src;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/users/mypage/myinfo", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			alert(res.message);
			if (res.code === 1)
				document.querySelector('button[name="profile_image"]').dataset.view = "false";
		}
	};
	xhr.send(JSON.stringify({ profile_image: profile_image }));
});
// 이메일 인증하기
const fnCertyEmail = function () {
	let email = document.querySelector('input[name="user_id"]');
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/mail/certify", true);
	xhr.setRequestHeader("Content-Type", "appliction/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			if (res.code === 1) {
				alert("성공적으로 인증 확인 메일을 발송했습니다.");
			} else {
				alert(res.message);
			}
		}
	};
	xhr.send(JSON.stringify({ user_id: email.value }));
};
