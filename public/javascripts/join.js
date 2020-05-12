document.querySelector('input[name="chk_all"]').addEventListener("click", function () {
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
  let chkAllTerms = document.querySelector('input[name="chkAllTerms"]');
  if (!chkAllTerms.checked) {
    alert("개인정보 처리방침 및 퍼즐풋볼 이용약관에 동의해주세요");
    return false;
  }
  let profile_img = document.querySelector(".fileinput-preview img");
  let user_id = document.querySelector('input[name="user_id"]');
  let user_pw = document.querySelector('input[name="user_pw"]');
  let user_pw_chk = document.querySelector('input[name="user_pw_chk"]');
  let user_name = document.querySelector('input[name="user_name"]');
  let user_phone = document.querySelector('input[name="user_phone"]');
  let phone1 = document.querySelector('input[name="phone1"]');
  let phone2 = document.querySelector('input[name="phone2"]');

  let gender = document.querySelector('select[name="gender"]');
  let birth =
    document.querySelector('select[name="birth_y"]').value +
    "-" +
    document.querySelector('select[name="birth_m"]').value +
    "-" +
    document.querySelector('select[name="birth_d"]').value;
  let certifiedNumber = document.querySelector('input[name="certifiedNumber"]');
  let position = document.querySelector('select[name="position"]');
  let skill = document.querySelector('button[name="skill"][data-toggle="true"]');

  // let user_nickname = document.querySelector('input[name="user_nickname"]');
  // let user_email = document.querySelector('input[name="user_email"]');
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
  if (phone1.value === "") {
    alert("휴대폰 번호를 입력해 주세요");
    phone1.focus();
    return false;
  }
  if (phone2.value === "") {
    alert("휴대폰 번호를 입력해 주세요");
    phone2.focus();
    return false;
  }
  if (certifiedNumber.value === "") {
    alert("인증번호를 입력해 주세요");
    certifiedNumber.focus();
    return false;
  }
  // if (user_email.value === "") {
  //   alert("이메일을 입력해 주세요");
  //   user_email.focus();
  //   return false;
  // }
  // if (email_verify_number.value === "") {
  //   alert("이메일 인증번호를 입력해주세요");
  //   email_verify_number.focus();
  //   return false;
  // }
  let formData = {};
  formData["user_id"] = user_id.value;
  formData["user_pw"] = user_pw.value;
  formData["user_name"] = user_name.value;
  formData["gender"] = gender.value;
  formData["user_phone"] = user_phone.value;
  formData["phone1"] = phone1.value;
  formData["phone2"] = phone2.value;
  formData["birth"] = birth;
  formData["position"] = position.value;
  formData["certifiedNumber"] = certifiedNumber.value;
  if (skill) formData["skill"] = skill.dataset.value;
  if (profile_img) formData["profile_image"] = profile_img.src;
  console.log("formData : ", formData);

  // formData["user_nickname"] = user_nickname.value;
  // formData["user_email"] = user_email.value;
  // formData["email_verify_number"] = email_verify_number.value;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/users/register", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
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
  xhr.onreadystatechange = function () {
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
$("#modalJoin").on("hidden.bs.modal", function () {
  fnAddInfo("main");
});
let skill_btns = document.querySelectorAll(".skill-btn-wrap button");
skill_btns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    skill_btns.forEach(function (b) {
      b.dataset.toggle = "false";
    });
    btn.dataset.toggle = "true";
  });
});
//  인증번호 발송
document.querySelector('button[name="btnSendCertify"]').addEventListener("click", function () {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/users/certify", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      console.log("res : ", res);
      if (res.code === 1) {
        alert("인증번호를 발송했습니다. (" + res.rnd + ")");
      }
    }
  };
  xhr.send();
});
//  인증번호 확인
document.querySelector('button[name="btnCertify"]').addEventListener("click", function () {
  let inpCertifyNumber = document.querySelector('input[name="certifiedNumber"]');
  if (inpCertifyNumber.value === "") {
    alert("인증번호를 입력해주세요");
    return false;
  }
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/users/certify", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.result) {
        alert("인증 성공");
      } else {
        alert("인증 번호가 다릅니다. 다시 확인해주세요");
      }
    }
  };
  xhr.send(JSON.stringify({ certifiedNumber: inpCertifyNumber.value }));
});
