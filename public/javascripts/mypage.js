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
async function fnCreateClub() {
  //  1. 클럽 가입 여부 확인
  console.log("start async");
  let res = JSON.parse(await fnCheckMyClub());
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
async function fnCheckMyClub() {
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