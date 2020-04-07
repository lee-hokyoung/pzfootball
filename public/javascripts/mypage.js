// 포인트 충전 모달창 팝업 이벤트
$("#modalChargePoint").on("show.bs.modal", function(v) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/users/point", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      let user_point = res.point || 0;
      let beforeCharge = document.getElementById("beforeCharge");
      beforeCharge.value = new Intl.NumberFormat().format(user_point);
      let inpAfterCharge = document.getElementById("afterCharge");
      inpAfterCharge.value = new Intl.NumberFormat().format(
        Number(user_point) +
          Number(document.getElementById("selectPoint").value)
      );
      $("#modalChargePoint").modal("show");
    }
  };
  xhr.send();
});
// 충전할 금액 선택 이벤트
$("#selectPoint").on("change", function() {
  let selectedPoint = Number($(this).val());
  let beforeCharge = Number(
    document.getElementById("beforeCharge").value.replace(/[^0-9.-]+/g, "")
  );
  let inpAfterCharge = document.getElementById("afterCharge");
  inpAfterCharge.value = new Intl.NumberFormat().format(
    selectedPoint + beforeCharge
  );
});
// 포인트 최종 충전
function fnConfirmChargePoint() {
  let formData = {};
  formData["point"] = document.getElementById("selectPoint").value;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/users/point/charge");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.code === 1) {
        alert(res.message);
        location.reload();
      } else {
        alert(res.message);
      }
    }
  };
  xhr.send(JSON.stringify(formData));
}

//  클럽 가입
function fnJoinClub() {
  //  1. 클럽 가입 여부 확인
  //  2. 클럽 리스트 페이지로 이동
}

//  클럽 생성
function fnCreateClub() {
  //  1. 클럽 가입 여부 확인
  console.log("start async");
  let res = JSON.parse(fnCheckMyClub());
  console.log("resut : ", res);
  if (res.code === 1) {
    if (res.result) {
      alert("이미 가입한 클럽이 있습니다.");
      return false;
    } else {
      //  2. 클럽 생성 페이지로 이동
      location.href = "/clubs/create";
    }
  } else {
    alert(res.message);
    return false;
  }
}

//  클럽 가입 여부 확인
function fnCheckMyClub() {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/users/myClub", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

// 개인정보 수정
function fnSaveUserInfo() {
  let user_name = document.querySelector('input[name="user_name"]');
  let user_nickname = document.querySelector('input[name="user_nickname"]');
  let user_email = document.querySelector('input[name="user_email"]');
  if (user_name.value === "") {
    alert("이름을 입력해주세요");
    user_name.focus();
    return false;
  }
  if (user_nickname.value === "") {
    alert("닉네임을 입력해주세요");
    user_nickname.focus();
    return false;
  }
  if (user_email.value === "") {
    alert("이메일을 입력해주세요");
    user_email.focus();
    return false;
  }
  let formData = {};
  formData["user_name"] = user_name.value;
  formData["user_nickname"] = user_nickname.value;
  formData["user_email"] = user_email.value;

  let xhr = new XMLHttpRequest();
  xhr.open("PUT", "/users/mypage/user_info", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert(res.message);
      if (res.code === 1) location.reload();
    }
  };
  xhr.send(JSON.stringify(formData));
}

//  지역별 전체 버튼 클릭
document.querySelectorAll('button[data-role="all"]').forEach(function(btn) {
  btn.addEventListener("click", function() {
    console.log(this);
    let id = this.dataset.id;
    let parent = document.querySelector('.ground-wrap[data-id="' + id + '"]');
    let parent_toggle = this.dataset.toggle;
    this.dataset.toggle = parent_toggle === "false";
    if (this.dataset.toggle === "true") this.innerHTML = "전체선택";
    else this.innerHTML = "전체해제";
    parent.querySelectorAll("button.btn-round").forEach(function(btn) {
      btn.dataset.toggle = parent_toggle === "false";
    });
  });
});
//  구장별 버튼 클릭시 이벤트
document.querySelectorAll("button[data-role='ground']").forEach(function(btn) {
  btn.addEventListener("click", function() {
    let toggle = this.dataset.toggle;
    this.dataset.toggle = toggle === "false";
  });
});
//  내 구장 정보 설정
document
  .querySelector('button[data-role="saveGround"]')
  .addEventListener("click", function() {
    let ground_list = [];
    document
      .querySelectorAll('button[data-role="ground"][data-toggle="true"]')
      .forEach(function(btn) {
        ground_list.push(btn.dataset.id);
      });
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/users/region", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        alert(res.message);
        if (res.code === 1) location.reload();
      }
    };
    xhr.send(JSON.stringify({ ground: ground_list }));
  });

//  내 정보 편집 아이콘 클릭 이벤트(아이콘 토글)
document
  .querySelectorAll(".user-info-wrap tbody td button[data-role]")
  .forEach(function(btn) {
    btn.addEventListener("click", function() {
      let td = btn.parentElement.parentElement;
      let input = td.querySelector("input");
      if (td.getAttribute("about") === "gender") {
        input = td.querySelector('input[type="radio"]:checked');
      }
      console.log("td : ", td, "input : ", input);
      switch (this.dataset.role) {
        case "edit":
        case "cancel":
          td.querySelectorAll("div[data-toggle], input[data-toggle]").forEach(
            function(div) {
              let toggle = div.dataset.toggle;
              div.dataset.toggle = toggle === "false";
            }
          );
          if (this.dataset.role === "edit") {
            input.removeAttribute("readonly");
          } else {
            input.setAttribute("readonly", "readonly");
          }
          break;
        case "confirm":
          let formData = {};
          let xhr = new XMLHttpRequest();
          xhr.open("POST", "/users/mypage/myinfo", true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.onreadystatechange = function() {
            if (
              this.readyState === XMLHttpRequest.DONE &&
              this.status === 200
            ) {
              let res = JSON.parse(this.response);
              alert(res.message);
              if (res.code === 1) {
                input.setAttribute("readonly", "readonly");
                td.querySelectorAll(
                  "div[data-toggle], input[data-toggle]"
                ).forEach(function(div) {
                  let toggle = div.dataset.toggle;
                  div.dataset.toggle = toggle === "false";
                });
                if (input.name === "gender") {
                  td.querySelector('input[name="gender"]').value =
                    input.value === "male"
                      ? "남자"
                      : input.value === "female"
                      ? "여자"
                      : "선택안함";
                }
                // if (this.dataset.role === "edit") {
                //   input.removeAttribute("readonly");
                // } else {
                //   input.setAttribute("readonly", "readonly");
                // }
              }
            }
          };
          formData[input.name] = input.value;
          xhr.send(JSON.stringify(formData));
          break;
      }
    });
  });
