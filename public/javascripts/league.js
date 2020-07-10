//  메인 슬라이더
$(".main-slider").on("init", function (e, s) {
	$(".full-cover-pzfutball").css("display", "none");
});
$(".main-slider").slick({
	dots: true,
	arrows: false,
	fade: false,
	autoplay: true,
	autoplaySpeed: 5000,
});
$("#schedule-wrap").slick({
	dots: false,
	infinite: false,
	slidesToShow: 7,
	slidesToScroll: 7,
});

// 일정/결과 slick slide 부분
$("#round-wrap").slick({
	dots: false,
	infinite: false,
	slidesToShow: 7,
	slidesToScroll: 7,
});
$("#league-list-wrap").slick({
	arrows: false,
	draggable: false,
});
let round_list = document.querySelectorAll('button[role="slick-tab"]');
round_list.forEach(function (btn) {
	btn.addEventListener("click", function () {
		round_list.forEach(function (btn) {
			btn.className = "btn";
		});
		this.className = "btn active";
		$("#league-list-wrap").slick("slickGoTo", this.dataset.id - 1);
	});
});
// 일정/결과 slick slide 부분 끝

$("#schedule-tab").on("shown.bs.tab", function () {
	$("#schedule-wrap").slick("setPosition");
});
// 지역, 리그 선택시 시즌 불러오기
document.querySelectorAll('select[data-role="search_season"]').forEach(function (select) {
	select.addEventListener("change", function (v) {
		let league_region = document.querySelector('select[name="league_region"]');
		let league_type = document.querySelector('select[name="league_type"]');
		if (league_region.value !== "" && league_type.value !== "") {
			let xhr = new XMLHttpRequest();
			xhr.open("GET", "/league/season/" + league_region.value + "/" + league_type.value, true);
			xhr.onreadystatechange = function () {
				if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
					let res = JSON.parse(this.response);
					let league_season = document.querySelector('select[name="league_season"]');
					let option = document.createElement("option");
					option.value = "";
					option.innerText = "시즌";
					league_season.innerHTML = "";
					league_season.appendChild(option);
					res.forEach(function (v) {
						option = document.createElement("option");
						option.value = v.season;
						option.innerText = v.season;
						league_season.appendChild(option);
					});
				}
			};
			xhr.send();
		}
	});
});
// 리그 검색 이벤트
const fnSearchLeague = function () {
	let league_region = document.querySelector('select[name="league_region"]');
	let league_type = document.querySelector('select[name="league_type"]');
	let league_season = document.querySelector('select[name="league_season"]');

	if (league_region.value === "" || league_type.value === "" || league_season.value === "") {
		return false;
	}
};
