// 매니저 등록/수정
function fnEditManager() {
  let formData = {};
  let _id = document.querySelector('input[name="_id"]');
  let manager_name = document.querySelector('input[name="manager_name"]');
  let manager_id = document.querySelector('input[name="manager_id"]');
  let manager_pw = document.querySelector('input[name="manager_pw"]');
  let gender = document.querySelector('input[name="gender"]:checked');
  let birth = document.querySelector('input[name="birth"]');
  let manager_phone = document.querySelector('input[name="manager_phone"]');
  let profile_image = document.querySelector(".fileinput-preview img");
  let user_id = document.querySelector('select[name="user_id"]');
  if (manager_name.value === "") {
    alert("이름을 입력해 주세요");
    manager_name.focus();
    return false;
  }
  if (manager_id.value === "") {
    alert("매니저 ID를 입력해 주세요");
    manager_id.focus();
    return false;
  }
  if (manager_pw.value === "") {
    alert("매니저 비밀번호를 입력해 주세요");
    manager_pw.focus();
    return false;
  }
  if (!gender) {
    alert("성별을 선택해 주세요");
    return false;
  }
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/manager", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.code === 1) {
        alert("등록되었습니다.");
        location.reload();
      } else {
        alert(res.message);
        return false;
      }
    }
  };
  if (_id.value !== "") formData["_id"] = _id.value;
  formData["manager_id"] = manager_id.value;
  formData["manager_pw"] = manager_pw.value;
  formData["manager_name"] = manager_name.value;
  formData["gender"] = gender.value;
  formData["birth"] = birth.value;
  formData["manager_phone"] = manager_phone.value;
  if (profile_image) formData["profile_image"] = profile_image.src;
  if (user_id.value !== "") formData["user_id"] = user_id.value;
  xhr.send(JSON.stringify(formData));
  return false;
}
//  매니저 정보 읽어오기
document.querySelectorAll('button[data-role="read"]').forEach(function (btn) {
  btn.addEventListener("click", function () {
    let _id = this.dataset.id;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/admin/manager/" + _id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        console.log("res : ", res);
        if (res.code === 1) {
          let manager_info = res.manager_info;
          let profile_img = document.querySelector("img.avatar.border-gray");
          if (manager_info.profile_image)
            profile_img.src = manager_info.profile_image;
          else profile_img.src = "/assets/img/default-avatar.png";
          document.querySelector('input[name="_id"]').value = manager_info._id;
          document.querySelector('h5.title[name="manager_name"]').innerHTML =
            manager_info.manager_name;
          document.querySelector('input[name="manager_name"]').value =
            manager_info.manager_name;
          document.querySelector(
            'input.form-check-input[value="' + manager_info.gender + '"]'
          ).checked = true;
          document.querySelector('input[name="manager_id"]').value =
            manager_info.manager_id;
          document.querySelector('input[name="manager_pw"]').value =
            manager_info.manager_pw;
          document.querySelector('input[name="birth"]').value =
            manager_info.birth;
          document.querySelector('input[name="manager_phone"]').value =
            manager_info.manager_phone;
          document.querySelector("select").value = manager_info.user_id;
          $("select").selectpicker("refresh");
        }
      }
    };
    xhr.send();
  });
});

//  신규등록 버튼 클릭 이벤트(에디터 초기화)
function fnReNewEditor() {
  document.querySelectorAll("form input.form-control").forEach(function (v) {
    v.value = "";
  });
  document.querySelector("input.form-check-input:checked").checked = false;
}

//  매니저 삭제하기
document.querySelectorAll('button[data-role="remove"]').forEach(function (v) {
  v.addEventListener("click", function () {
    if (!confirm("삭제하면 복구할 수 없습니다. 계속하시겠습니까?"))
      return false;
    let _id = this.dataset.id;
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/admin/manager/" + _id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        alert(res.message);
        if (res.code === 1) location.reload();
      }
    };
    xhr.send();
  });
});
