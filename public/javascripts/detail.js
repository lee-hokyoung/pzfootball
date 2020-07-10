$(".detail-slider").on("init", function (e, s) {
	$(".full-cover-pzfutball").css("display", "none");
});
$(".detail-slider").slick({
	dots: true,
	arrows: true,
	fade: true,
});
$("#theway-slider").slick({
	fade: true,
});
//  하단 참가하기 버튼 픽스
let scrollTarget = $("#scrollPosition");
let footer = document.querySelector("footer");
let bottomBtnWrap = document.querySelector("#bottomBtnWrap");
let footerImg = document.querySelector(".footer-img-wrap");
window.onscroll = function () {
	if (window.pageYOffset > scrollTarget.offset().top + scrollTarget.height()) {
		bottomBtnWrap.classList.add("position-fixed");
		let clientY = window.innerHeight + document.documentElement.scrollTop; // window.scrollY;
		let offsetHeight = document.body.offsetHeight - footer.scrollHeight - footerImg.scrollHeight;
		if (clientY >= offsetHeight) {
			let scroll = window.innerHeight + document.documentElement.scrollTop; // window.scrollY;
			let offHeight = document.body.offsetHeight - footer.scrollHeight - footerImg.scrollHeight;
			bottomBtnWrap.style.bottom = scroll - offHeight + "px";
		} else {
			bottomBtnWrap.style.bottom = "0px";
		}
	} else {
		bottomBtnWrap.classList.remove("position-fixed");
	}
};
window.addEventListener("scroll", function () {});

//  클립보드에 주소 복사
document.querySelector(".copy").addEventListener("click", function () {
	let copiedText = $(this).data().copy;
	var tempElem = document.createElement("textarea");
	tempElem.value = copiedText;
	document.body.appendChild(tempElem);

	tempElem.select();
	document.execCommand("copy");
	document.body.removeChild(tempElem);
	alert("클립보드에 복사되었습니다.");
});
//  신청하기 버튼 클릭 이벤트
function fnApplyGame() {
	// 로그인 체크
	let isLoggedIn = document.getElementById("isLoggedIn").dataset.islogin;
	if (isLoggedIn === "true") {
		// 포인트 확인
		fnGetUserPoint();
	} else {
		alert("로그인이 필요합니다.");
		location.href = "/users/login";
	}
}
// 포인트 확인
function fnGetUserPoint() {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "/users/point", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			let user_point = res.point || 0;
			document.getElementById("user_point").value = new Intl.NumberFormat().format(user_point);
			let selectMember = document.getElementById("selectMember").value;
			let match_price = match_info.match_price * selectMember;
			document.getElementById("require_point").value = new Intl.NumberFormat().format(match_price);
			let after_purchase = user_point - match_price;
			let inpAfterPurchase = document.getElementById("afterPurchase");
			inpAfterPurchase.value = new Intl.NumberFormat().format(after_purchase);
			if (after_purchase >= 0) {
				document.getElementById("requireFooter").className = "d-none";
				$("#afterPurchase").addClass("bg-success");
			} else {
				document.getElementById("confirmFooter").className = "d-none";
				$("#afterPurchase").addClass("bg-danger");
			}
			$("#modalMatchConfirm").modal("show");
		}
	};
	xhr.send();
}
// 매칭 신청 확인
function fnConfirmMatch() {
	let formData = {};
	let match_id = match_info._id;
	let member_cnt = $("#selectMember").val();
	let apply_member_list = document.querySelector("#modalMatchConfirm ul").dataset.id;
	if (parseInt(member_cnt) !== parseInt(apply_member_list.split(",").length)) {
		alert("신청 인원을 모두 입력해주세요");
		return false;
	}
	//  쿠폰 사용 여부 확인
	let user_coupon = document.querySelector('select[name="user_coupon"]');
	if (user_coupon) {
		formData["user_coupon"] = user_coupon.value;
	}

	formData["match_id"] = match_id;
	formData["member_cnt"] = member_cnt;
	formData["apply_member_list"] = apply_member_list;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/match/apply", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			if (res.code === 1) {
				alert("정상적으로 신청했습니다.");
				location.reload();
			} else {
				alert(res.message);
			}
		}
	};
	console.log("form data : ", formData);
	xhr.send(JSON.stringify(formData));
}
//  쿠폰 선택 이벤트 (결제 후 포인트 계산)
const fnSetPoint = function () {
	// 보유 포인트
	let user_point = Number(document.getElementById("user_point").value.replace(/[^0-9.-]+/g, ""));
	let member_cnt = Number(document.querySelector("#selectMember").value);
	// 보유 쿠폰
	let user_coupon = document.querySelector('select[name="user_coupon"] option:checked');
	if (user_coupon) Number(user_coupon.dataset.point) || 0;

	// 차감포인트
	let match_price = match_info.match_price * member_cnt - user_coupon;
	document.getElementById("require_point").value = new Intl.NumberFormat().format(match_price);
	let afterPurchase = user_point - match_price;
	let inpAfterPurchase = document.getElementById("afterPurchase");
	inpAfterPurchase.value = new Intl.NumberFormat().format(afterPurchase);
	console.log("afterPurchase : ", afterPurchase);
	// 결제 후 포인트 잔여여부
	if (afterPurchase >= 0) {
		inpAfterPurchase.className = "form-control text-white bg-success";
		document.getElementById("confirmFooter").className = "";
		document.getElementById("requireFooter").className = "d-none";
	} else {
		inpAfterPurchase.className = "form-control text-white bg-danger";
		document.getElementById("confirmFooter").className = "d-none";
		document.getElementById("requireFooter").className = "";
	}
};
let isCoupon = document.querySelector('select[name="user_coupon"]');
if (isCoupon) {
	isCoupon.addEventListener("change", function () {
		fnSetPoint();
	});
}
// 신청인원 수 조정 이벤트
$("#selectMember").on("change", function () {
	let user_id = $(this).data("id");
	//  포인트 변경
	fnSetPoint();

	let member_cnt = Number(document.querySelector("#selectMember").value);
	//  참여인원 칸 늘리기
	let apply_member_info = document.querySelector("#apply_member_info");
	apply_member_info.dataset.id = user_id;
	let apply_list = [user_id];
	let apply_member_list = document.querySelector("#apply_member_list");
	apply_member_list.innerHTML = "";

	if (member_cnt > 1) {
		for (var i = 1; i < member_cnt; i++) {
			let li = document.createElement("li");
			li.className = "list-group-item";
			let row = document.createElement("div");
			row.className = "row";
			let = col = document.createElement("div");
			col.className = "col-9 form-group m-0 px-0";
			let input = document.createElement("input");
			input.className = "form-control m-0";
			input.placeholder = "연락처 뒤 4자리 입력";
			col.appendChild(input);
			row.appendChild(col);

			col = document.createElement("div");
			col.className = "col-3 px-0 text-center";
			let button = document.createElement("button");
			button.className = "btn btn-danger my-auto";
			button.innerText = "찾기";
			//  연락처 뒷 4자리로 회원 찾기
			button.addEventListener("click", function () {
				console.log(this);
				let parent_row = this.parentElement.parentElement;
				let phone = parent_row.querySelector("input");
				if (phone.value === "") {
					alert("연락처를 입력해 주세요");
					return false;
				}
				let xhr = new XMLHttpRequest();
				xhr.open("GET", "/users/find/" + phone.value, true);
				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.onreadystatechange = function () {
					if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
						let res = JSON.parse(this.response);
						if (res.code === 1) {
							let list = res.result;
							let tbody = document.querySelector("#searchResultTable tbody");
							tbody.innerHTML = "";
							if (list.length > 0) {
								list.forEach(function (v) {
									let tr = document.createElement("tr");
									let td = document.createElement("td");
									td.innerText = v.user_name;
									tr.appendChild(td);

									td = document.createElement("td");
									td.innerText = v.user_id;
									tr.appendChild(td);

									td = document.createElement("td");
									let button = document.createElement("button");
									button.className = "btn btn-primary btn-sm";
									button.dataset.user_name = v.user_name;
									button.dataset.user_id = v.user_id;
									button.dataset._id = v._id;
									button.innerText = "선택";
									//  검색된 회원 선택시 이벤트
									button.addEventListener("click", function () {
										if (apply_list.indexOf(v._id) > -1) {
											alert("이미 선택한 회원입니다.");
											return false;
										} else {
											apply_list.push(v._id);
											parent_row.innerHTML = "";
											let col = document.createElement("div");
											col.className = "col-3";
											col.innerText = this.dataset.user_name;
											parent_row.appendChild(col);

											col = document.createElement("div");
											col.className = "col-9";
											col.innerText = this.dataset.user_id;
											parent_row.appendChild(col);
											$("#searchResultModal").modal("hide");
											//  ul dataset.id 에 현재까지 선택된 리스트 넣기
											apply_member_info.dataset.id = apply_list.toString();
										}
									});
									td.appendChild(button);
									tr.appendChild(td);
									tbody.appendChild(tr);
								});
							} else {
								let tr = document.createElement("tr");
								let td = document.createElement("td");
								td.setAttribute("colspan", "2");
								td.innerText = "검색 결과가 없습니다.";
								td.className = "text-center";
								tr.appendChild(td);
								tbody.appendChild(tr);
							}
							$("#searchResultModal").modal("show");
						}
					}
				};
				xhr.send();
			});
			col.appendChild(button);
			row.appendChild(col);
			li.appendChild(row);
			apply_member_list.appendChild(li);
		}
	}
});
//  카카오 지도 보기
let map_info = match_info.ground_info.mapInfo;
let mapContainer = document.querySelector("#kakao_map");
let mapOption = {
	center: new kakao.maps.LatLng(map_info.Lat, map_info.Lng),
	level: 3,
};
let map = new kakao.maps.Map(mapContainer, mapOption);
let markerPosition = new kakao.maps.LatLng(map_info.Lat, map_info.Lng);
let marker = new kakao.maps.Marker({
	position: markerPosition,
});
marker.setMap(map);
//  즐겨찾기 구장 추가 버튼 클릭 이벤트
let btnFavoriteGround = document.querySelector('button[name="btnFavoriteGround"]');
if (btnFavoriteGround) {
	document.querySelector('button[name="btnFavoriteGround"]').addEventListener("click", function () {
		let this_btn = this;
		let isFavorite = this.dataset.toggle === "true";
		let xhr = new XMLHttpRequest();
		xhr.open("PATCH", "/users/favorite", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				let res = JSON.parse(this.response);
				if (res.code === 1) {
					if (isFavorite) {
						this_btn.dataset.toggle = "false";
					} else {
						this_btn.dataset.toggle = "true";
					}
				} else {
					alert(res.message);
				}
			}
		};
		xhr.send(JSON.stringify({ ground_id: this.dataset.id, isFavorite: isFavorite }));
	});
}

//  주의사항, 취소/환불 클릭시 아래 픽스 움직임 부자연스러운 부분 수정..
$("div[data-role='collapse']").on("show.bs.collapse", function () {
	document.querySelector("#bottomBtnWrap").style.bottom = "0px";
});
