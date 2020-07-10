// 로그인
function fnSubmitLoginPage() {
	let user_id = document.querySelector("#user_id");
	let user_pw = document.querySelector("#user_pw");
	let idSave = document.querySelector('input[name="idSave"]');
	if (user_id.value === "") {
		alert("이메일을 입력해 주세요");
		user_id.focus();
		return false;
	}
	if (user_pw.value === "") {
		alert("비밀번호를 입력해 주세요");
		user_pw.focus();
		return false;
	}
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/users/login", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			if (res.code === 1) {
				location.replace("/");
			} else {
				alert(res.message);
			}
		}
	};
	xhr.send(
		JSON.stringify({
			user_id: user_id.value,
			user_pw: user_pw.value,
			idSave: idSave.checked,
		})
	);
	return false;
}
// 팝업창 로그인 버튼 클릭 => 아이디 자동 입력
const fnCloseModal = function (modal) {
	$(modal).modal("hide");
};
