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
const fnApplyLeageu = function () {
	let league_id = document.querySelector('select[name="apply_league"]').value;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/league/request", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			alert(res.message);
			if (res.code === 1) location.reload();
			console.log("res : ", res);
		}
	};
	xhr.send(JSON.stringify({ league_id: league_id }));
};
