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
