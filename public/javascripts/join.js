document
  .querySelector('input[name="chk_all"]')
  .addEventListener("click", function() {
    console.log(this);
    let chk_term = document.querySelector('input[name="chk_terms"]');
    let chk_privacy = document.querySelector('input[name="chk_privacy"]');
    if (this.checked) {
      chk_term.checked = true;
      chk_privacy.checked = true;
    } else {
      chk_term.checked = false;
      chk_privacy.checked = false;
    }
  });

// 회원가입
function fnJoin() {
  //  이용약관, 개인정보 수집 및 이용에 대한 안내
  let chk_terms = document.querySelector('input[name="chk_terms"]');
  let chk_privacy = document.querySelector('input[name="chk_privacy"]');
  if (!chk_terms.checked) {
    alert("이용약관에 동의해 주세요");
    chk_terms.focus();
    return false;
  }
  if (!chk_privacy.checked) {
    alert("개인정보 수집에 동의해 주세요");
    chk_privacy.focus();
    return false;
  }

  let user_id = document.querySelector('input[name="user_id"]');
  let user_pw = document.querySelector('input[name="user_pw"]');
  let user_pw_chk = document.querySelector('input[name="user_pw_chk"]');
  let user_name = document.querySelector('input[name="user_name"]');
  let user_phone = document.querySelector('input[name="user_phone"]');

  let user_nickname = document.querySelector('input[name="user_nickname"]');
  let gender = document.querySelector('select[name="gender"]');
  let birth =
    document.querySelector('select[name="birth_y"]').value +
    "-" +
    document.querySelector('select[name="birth_m"]').value +
    "-" +
    document.querySelector('select[name="birth_d"]').value;
  let user_email = document.querySelector('input[name="user_email"]');
  // let email_verify_number = document.querySelector(
  //   'input[name="email_verify_number"]'
  // );
  if (user_id.value === "") {
    alert("아이디를 입력해주세요");
    user_id.focus();
    return false;
  }
  if (user_pw.value === "") {
    alert("비밀번호를 입력해주세요");
    user_pw.focus();
    return false;
  }
  if (user_pw.value !== user_pw_chk.value) {
    alert("비밀번호 입력값이 서로 다릅니다");
    user_pw.focus();
    return false;
  }
  if (user_name.value === "") {
    alert("이름을 입력해주세요");
    user_name.focus();
    return false;
  }
  if (gender.value === "") {
    alert("성별을 선택해주세요");
    gender.focus();
    return false;
  }
  if (user_phone.value === "") {
    alert("휴대폰 번호를 입력해 주세요");
    user_phone.focus();
    return false;
  }
  if (user_email.value === "") {
    alert("이메일을 입력해 주세요");
    user_email.focus();
    return false;
  }
  // if (email_verify_number.value === "") {
  //   alert("이메일 인증번호를 입력해주세요");
  //   email_verify_number.focus();
  //   return false;
  // }
  let formData = {};
  formData["user_id"] = user_id.value;
  formData["user_pw"] = user_pw.value;
  formData["user_name"] = user_name.value;
  // formData["user_nickname"] = user_nickname.value;
  formData["gender"] = gender.value;
  formData["birth"] = birth;
  formData["user_email"] = user_email.value;
  // formData["email_verify_number"] = email_verify_number.value;
  console.log("formData : ", formData);

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/users/register", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.code === 1) {
        $("#modalJoin").modal("show");
      } else {
        alert(res.message);
      }
    }
  };
  xhr.send(JSON.stringify(formData));
  return false;
}
//  추가정보 입력 선택했을 경우
function fnAddInfo(target) {
  let formData = {};
  let user_id = document.querySelector('input[name="user_id"]');
  let user_pw = document.querySelector('input[name="user_pw"]');
  formData["user_id"] = user_id.value;
  formData["user_pw"] = user_pw.value;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/users/login/" + target, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.code === 1) {
        location.href = res.target;
      } else {
        alert(res.message);
        return false;
      }
    }
  };
  xhr.send(JSON.stringify(formData));
}
//  모달 닫혔을 때 이벤트
$("#modalJoin").on("hidden.bs.modal", function() {
  fnAddInfo("main");
});
