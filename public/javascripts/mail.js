//  아이디(이메일) 찾기
const fnFindEmail = function () {
  let formData = {};
  let user_name = document.querySelector('input[name="user_name"]');
  let user_phone = document.querySelector('input[name="user_phone"]');
  let phone1 = document.querySelector('input[name="phone1"]');
  let phone2 = document.querySelector('input[name="phone2"]');
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
        document.querySelector('input[name="result"]').value = res.result.user_id;
        document.querySelector("#findIdResult").className = "form-group";
      }
    }
  };
  xhr.send(JSON.stringify(formData));
};

//  비밀번호 찾기(비밀번호 재설정)
const fnResetPw = function () {
  let toMail = document.querySelector('input[name="email"]');
  if (toMail.value === "") {
    alert("메일을 입력해 주세요.");
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
  xhr.send(JSON.stringify({ email: toMail.value }));
};
