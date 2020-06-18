Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

$(document).ready(function () {
	// sidebar 관련
	$("#sidebar").mCustomScrollbar({
		theme: "minimal",
	});

	$("#dismiss, .overlay").on("click", function () {
		// hide sidebar
		$("#sidebar").removeClass("active");
		// hide overlay
		$(".overlay").removeClass("active");
	});

	$("#sidebarCollapse").on("click", function () {
		// open sidebar
		$("#sidebar").addClass("active");
		// fade in the overlay
		$(".overlay").addClass("active");
		$(".collapse.in").toggleClass("in");
		$("a[aria-expanded=true]").attr("aria-expanded", "false");
	});
});

// KB에스크로 이체 인증마크 적용 시작
function onPopKBAuthMark() {
	window.open("about:blank", "KB_AUTHMARK", "height=604, width=648");
	document.KB_AUTHMARK_FORM.action = "http://escrow1.kbstar.com/quics";
	document.KB_AUTHMARK_FORM.target = "KB_AUTHMARK";
	document.KB_AUTHMARK_FORM.submit();
}
