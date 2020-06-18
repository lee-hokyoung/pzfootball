// 포인트 충전 모달창 팝업 이벤트
$("#modalChargePoint").on("show.bs.modal", function (v) {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "/users/point", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			let user_point = res.point || 0;
			let beforeCharge = document.getElementById("beforeCharge");
			beforeCharge.value = new Intl.NumberFormat().format(user_point);
			let inpAfterCharge = document.getElementById("afterCharge");
			inpAfterCharge.value = new Intl.NumberFormat().format(
				Number(user_point) + Number(document.getElementById("selectPoint").value)
			);
			$("#modalChargePoint").modal("show");
		}
	};
	xhr.send();
});
// 충전할 금액 선택 이벤트
$("#selectPoint").on("change", function () {
	let selectedPoint = Number($(this).val());
	let beforeCharge = Number(
		document.getElementById("beforeCharge").value.replace(/[^0-9.-]+/g, "")
	);
	let inpAfterCharge = document.getElementById("afterCharge");
	inpAfterCharge.value = new Intl.NumberFormat().format(selectedPoint + beforeCharge);
});
// 포인트 최종 충전
function fnConfirmChargePoint() {
	let formData = {};
	// 충전 방식 확인
	let chargeType = document.querySelector('button[name="chargeType"][data-toggle="true"]');
	if (chargeType === null) {
		alert("충전 방식을 선택해 주세요");
		return false;
	}
	formData["chargeType"] = chargeType.value;
	formData["point"] = document.getElementById("selectPoint").value;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/users/point/charge");
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
let chargeBtns = document.querySelectorAll('button[name="chargeType"]');
chargeBtns.forEach(function (btn) {
	btn.addEventListener("click", function () {
		chargeBtns.forEach(function (v) {
			v.dataset.toggle = "false";
		});
		this.dataset.toggle = "true";
	});
});
