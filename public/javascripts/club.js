//  클럽 생성하기
function fnRegisterClub() {
  let club_mark = document.querySelector('div[name="club_mark"] img');
  let club_name = document.querySelector('input[name="club_name"]');
  let club_region = document.querySelector('input[name="club_region"]');
  let club_desc = document.querySelector('textarea[name="club_desc"]');
  if (!club_name.value) {
    alert("클럽명을 입력해주세요");
    return false;
  }
  let formData = {};
  formData["club_mark"] = club_mark ? club_mark.src : "";
  formData["club_name"] = club_name.value;
  formData["club_region"] = club_region.value || "";
  formData["club_desc"] = club_desc.value || "";

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/clubs/create", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.code === 1) {
        alert("정상적으로 등록되었습니다");
        location.href = "/clubs/list";
      } else {
        alert(res.message);
        return false;
      }
    }
  };
  xhr.send(JSON.stringify(formData));
}

//  클럽 가입하기
function fnJoinClub(club_id) {
  if (!confirm("가입하시겠습니까?")) return false;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/clubs/join", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert(res.message);
      if (res.code === 1) location.reload();
    }
  };
  xhr.send(JSON.stringify({ _id: club_id }));
}

//  클럽 탈퇴하기
function fnSecession(club_id) {
  if (confirm("정말 탈퇴하시겠습니까?")) {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/clubs/" + club_id);
    xhr.setRequestHeader("Content-Type", "application/json", true);
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        alert(res.message);
        if (res.code === 1) location.reload();
      }
    };
    xhr.send();
  }
}

//  클럽 추방
function fnExile(user_id, club_id) {
  if (confirm("정말 추방하시겠습니까?")) {
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", "/clubs/exile");
    xhr.setRequestHeader("Content-Type", "application/json", true);
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        alert(res.message);
        if (res.code === 1) location.reload();
      }
    };
    xhr.send(JSON.stringify({ user_id: user_id, club_id: club_id }));
  }
}

//  분류 버튼 클릭 이벤트
document
  .querySelectorAll("button[data-role='team-type']")
  .forEach(function(btn) {
    btn.addEventListener("click", function() {
      document
        .querySelectorAll("button[data-role='team-type']")
        .forEach(function(item) {
          item.dataset.toggle = "false";
        });
      let toggle = this.dataset.toggle;
      this.dataset.toggle = toggle === "false";
    });
  });
document
  .querySelectorAll("button[data-role='team-gender']")
  .forEach(function(btn) {
    btn.addEventListener("click", function() {
      document
        .querySelectorAll("button[data-role='team-gender']")
        .forEach(function(item) {
          item.dataset.toggle = "false";
        });
      let toggle = this.dataset.toggle;
      this.dataset.toggle = toggle === "false";
    });
  });
//  팀 이름 중복확인
function fnChkDuplicate() {
  let club_name = document.querySelector('input[name="club_name"]');
  if (club_name.value === "") {
    alert("팀 이름을 입력해 주세요");
    return false;
  }
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/clubs/chkDuplication/" + club_name.value, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert(res.message);
      let club_name_chk = document.querySelector(
        'input[name="club_name_check"]'
      );
      if (res.code === 1) {
        club_name_chk.value = club_name.value;
      } else {
        club_name_chk.value = "";
      }
    }
  };
  xhr.send();
}
//  팀 등록하기
function fnRegisterClub() {
  let club_mark = document.querySelector('div[name="club_mark"] img');
  let team_type = document.querySelector(
    'button[data-role="team-type"][data-toggle="true"]'
  );
  let team_gender = document.querySelector(
    'button[data-role="team-gender"][data-toggle="true"]'
  );
  let mainly_ground = document.querySelector('select[name="mainly_ground"]');
  let mainly_day = document.querySelector('select[name="mainly_day"]');
  let mainly_time = document.querySelector('select[name="mainly_time"]');
  let club_name = document.querySelector('input[name="club_name"]');
  let club_name_check = document.querySelector('input[name="club_name_check"]');
  let club_leader = document.querySelector('input[name="club_leader"]');
  let team_email = document.querySelector('input[name="team_email"]');
  let phone_1 = document.querySelector('input[name="phone_1"]');
  let phone_2 = document.querySelector('input[name="phone_2"]');
  let phone_3 = document.querySelector('input[name="phone_3"]');
  let club_desc = document.querySelector('textarea[name="club_desc"]');
  let uniform_top = document.querySelector('input[name="uniform_top"]');
  let uniform_bottom = document.querySelector('input[name="uniform_bottom"]');
  let team_password = document.querySelector('input[name="team_password"]');
  let team_password_check = document.querySelector(
    'input[name="team_password_check"]'
  );
  let rating = document.querySelector("fieldset.rating input:checked");
  if (!team_type) {
    alert("팀 분류를 선택해 주세요");
    return false;
  }
  if (!team_gender) {
    alert("팀 구분을 선택해 주세요");
    return false;
  }
  if (mainly_ground.value === "") {
    alert("주 이용구장을 선택해 주세요");
    return false;
  }
  if (mainly_day.value === "") {
    alert("주 이용요일을 선택해 주세요");
    return false;
  }
  if (mainly_time.value === "") {
    alert("주 이용시간을 선택해 주세요");
    return false;
  }
  if (club_name.value === "") {
    alert("팀 이름을 입력해 주세요");
    return false;
  }
  if (team_email.value === "") {
    alert("이메일을 입력해 주세요");
    return false;
  }
  if (phone_1.value === "" || phone_2.value === "" || phone_3.value === "") {
    alert("폰 번호를 입력해 주세요");
    return false;
  }
  if (club_desc.value === "") {
    alert("간략한 팀소개 글을 작성해 주세요");
    return false;
  }
  if (!rating) {
    alert("팀 등급을 설정해 주세요");
    return false;
  }
  if (team_password.value === "") {
    alert("팀 비밀번호를 입력해 주세요");
    return false;
  }
  if (team_password.value !== team_password_check.value) {
    alert("입력하신 비밀번호가 서로 일치하지 않습니다.");
    return false;
  }
  if (
    club_name_check.value === "" ||
    club_name.value !== club_name_check.value
  ) {
    alert("팀 이름 중복 확인 해주세요");
    return false;
  }
  let formData = {};
  formData["team_type"] = team_type.dataset.value;
  formData["team_gender"] = team_gender.dataset.value;
  formData["mainly_ground"] = mainly_ground.value;
  formData["mainly_day"] = mainly_day.value;
  formData["mainly_time"] = mainly_time.value;
  formData["club_name"] = club_name.value;
  formData["club_leader"] = club_leader.value;
  formData["team_email"] = team_email.value;
  formData["team_phone"] =
    phone_1.value + "-" + phone_2.value + "-" + phone_3.value;
  formData["club_desc"] = club_desc.value;
  formData["uniform_top"] = uniform_top.value;
  formData["uniform_bottom"] = uniform_bottom.value;
  formData["rating"] = rating.value;
  formData["team_password"] = team_password.value;
  if (club_mark) formData["club_mark"] = club_mark.src;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/clubs/create", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert(res.message);
      if (res.code === 1) location.href = "/users/mypage";
    }
  };
  xhr.send(JSON.stringify(formData));
  return false;
}
//  팀 가입 승인하기
function fnApprove(user_id, team_id) {
  console.log(user_id, team_id);
  let xhr = new XMLHttpRequest();
  xhr.open("PATCH", "/clubs/approve", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert(res.message);
      if (res.code === 1) location.reload();
    }
  };
  xhr.send(JSON.stringify({ user_id: user_id, team_id: team_id }));
}
