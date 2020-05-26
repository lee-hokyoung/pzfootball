/*  쿠폰관련 script */
document.querySelector('button[name="btnCreateCp"]').addEventListener("click", function () {
  let cp_name = document.querySelector('input[name="cp_name"]');
  let cp_point = document.querySelector('input[name="cp_point"]');
  let cp_description = document.querySelector('input[name="cp_description"]');
  if (cp_name.value === "" || cp_point.value === "" || cp_description.value === "") {
    alert("빈칸을 모두 채워주세요");
    return false;
  }
  let formData = {};
  formData["cp_name"] = cp_name.value;
  formData["cp_point"] = cp_point.value;
  formData["cp_description"] = cp_description.value;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/coupon", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert(res.message);
      if (res.code === 1) location.reload();
    }
  };
  xhr.send(JSON.stringify(formData));
});
//  쿠폰 삭제
document.querySelectorAll('button[data-role="cp-delete"]').forEach(function (btn) {
  btn.addEventListener("click", function () {
    if (confirm("삭제하시겠습니까?")) {
      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", "/admin/coupon/" + this.dataset.id, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          let res = JSON.parse(this.response);
          alert(res.message);
          if (res.code === 1) location.reload();
        }
      };
      xhr.send();
    }
  });
});
//  회원 검색
const fnSearchUser = function () {
  let searchUser = document.querySelector('input[name="search_user"]');
  if (searchUser.value === "") {
    alert("회원을 입력해주세요");
    searchUser.focus();
    return false;
  }
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/admin/coupon/findUser/" + searchUser.value, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.result.length === 0) {
        alert("검색된 회원이 없습니다.");
        return false;
      }
      let coupon = document.querySelector('select[name="coupon"]');
      if (coupon.value === "") {
        alert("적용할 쿠폰을 선택해 주세요");
        return false;
      }
      let tbody = document.querySelector('tbody[name="searchUserList"]');
      tbody.innerHTML = "";
      res.result.forEach(function (user) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.innerText = user.user_name + " (" + user.user_id + ")";
        tr.appendChild(td);
        td = document.createElement("td");
        let button = document.createElement("button");
        button.className = "btn btn-primary btn-neutral";
        button.innerText = "발행";
        button.addEventListener("click", function () {
          let formData = {};
          formData["coupon_id"] = coupon.value;
          formData["user_id"] = user._id;
          let xhr = new XMLHttpRequest();
          xhr.open("POST", "/admin/coupon/publish", true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
              let res = JSON.parse(this.response);
              alert(res.message);
              if (res.code === 1) location.reload();
            }
          };
          xhr.send(JSON.stringify(formData));
        });
        td.appendChild(button);
        tr.appendChild(td);
        tbody.appendChild(tr);
      });
    }
  };
  xhr.send();
};
