const fnSubmitResetPW = function () {
	let user_pw = document.querySelector('input[name="user_pw"]');
	let user_pw_confirm = document.querySelector('input[name="user_pw"]');
	if (user_pw.value === "" || user_pw_confirm.value === "") {
		alert("비밀번호를 입력해 주세요");
		return false;
	}
	if (user_pw.value !== user_pw_confirm.value) {
		alert("입력한 비밀번호가 서로 다릅니다.");
		return false;
	}
	let formData = {};
	document.querySelectorAll(".page-wrap input").forEach(function (v) {
		formData[v.name] = v.value;
	});

	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/firebase?mode=resetPassword", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			console.log("res : ", res);
			if (res.code === 1) {
				alert("비밀번호가 정상적으로 변경되었습니다. ");
				location.href = "/users/login";
			} else if (res.code === "auth/weak-password") {
				alert("비밀번호는 최소 6자리 이상 입력해주세요");
			}
		}
	};
	xhr.send(JSON.stringify(formData));
};
