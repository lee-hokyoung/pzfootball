function fnRegisterClub() {
  let club_mark = document.querySelector('div[name="club_mark"] img');
  let club_name = document.querySelector('input[name="club_name"]');
  let club_region = document.querySelectorAll('input[name="club_region"]');
  let club_desc = document.querySelectorAll('input[name="club_desc"]');
  if (!club_name.value) {
    alert("클럽명을 입력해주세요");
    return false;
  }
  let formData = {};
  formData["club_mark"] = club_mark ? club_mark.src : "";
  formData["club_name"] = club_name.value;
  formData["club_region"] = club_region.value || "";
  formData["club_decs"] = club_desc.value || "";

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
