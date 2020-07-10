//  아이디(이메일) 찾기
const fnFindEmail = function () {
	let formData = {};
	let user_name = document.querySelector('#modalFindId input[name="user_name"]');
	let user_phone = document.querySelector('#modalFindId input[name="user_phone"]');
	let phone1 = document.querySelector('#modalFindId input[name="phone1"]');
	let phone2 = document.querySelector('#modalFindId input[name="phone2"]');
	if (user_name.value === "") {
		alert("이름을 입력해주세요");
		return false;
	}
	if (user_phone.value === "" || phone1.value === "" || phone2.value === "") {
		alert("연락처를 입력해주세요");
		return false;
	}
	formData["user_name"] = user_name.value;
	formData["user_phone"] = user_phone.value;
	formData["phone1"] = phone1.value;
	formData["phone2"] = phone2.value;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/mail/findId", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			let res = JSON.parse(this.response);
			if (res.code === 0) {
				document.querySelector("#findIdResult").className = "form-group d-none";
				alert(res.message);
			} else {
				let user_id = res.result.user_id;
				let first = user_id.split("@")[0];
				let second = user_id.split("@")[1];
				let hide_id =
					first.slice(0, first.length - 3) +
					"***" +
					"@" +
					second.slice(0, second.length - 5) +
					"*****";
				document.querySelector('input[name="result"]').value = hide_id;
				document.querySelector("#findIdResult").className = "form-group";
				document.querySelector("#findId-wrap").className = "d-none";
			}
		}
	};
	xhr.send(JSON.stringify(formData));
};

//  비밀번호 찾기(비밀번호 재설정)
const fnResetPw = function () {
	let toMail = document.querySelector('#modalFindPw input[name="user_id"]');
	let user_name = document.querySelector('#modalFindPw input[name="user_name"]');
	let user_phone = document.querySelector('#modalFindPw input[name="user_phone"]');
	let phone1 = document.querySelector('#modalFindPw input[name="phone1"]');
	let phone2 = document.querySelector('#modalFindPw input[name="phone2"]');
	if (toMail.value === "") {
		alert("메일을 입력해 주세요.");
		toMail.focus();
		return false;
	}
	if (user_name.value === "") {
		alert("이름을 입력해 주세요.");
		user_name.focus();
		return false;
	}
	if (user_phone.value === "") {
		alert("연락처를 입력해 주세요.");
		user_phone.focus();
		return false;
	}
	if (phone1.value === "") {
		alert("연락처 입력해 주세요.");
		phone1.focus();
		return false;
	}
	if (phone2.value === "") {
		alert("연락처 입력해 주세요.");
		phone2.focus();
		return false;
	}
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/mail/resetPw", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onloadstart = function () {
		document.querySelector("#loadingPage").className = "";
	};
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			document.querySelector("#loadingPage").className = "d-none";
			let res = JSON.parse(this.response);
			alert(res.message);
			if (res.code === 1) location.reload();
		}
	};
	let formData = {};
	formData["user_id"] = toMail.value;
	formData["user_name"] = user_name.value;
	formData["user_phone"] = user_phone.value;
	formData["phone1"] = phone1.value;
	formData["phone2"] = phone2.value;

	xhr.send(JSON.stringify(formData));
};
