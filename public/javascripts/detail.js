$(".detail-slider").slick({
  dots: true,
  arrows: false,
  fade: true
});
//  클립보드에 주소 복사
document.querySelector(".copy").addEventListener("click", function() {
  console.log($(this));
  let copiedText = $(this).data().copy;
  var tempElem = document.createElement("textarea");
  tempElem.value = copiedText;
  document.body.appendChild(tempElem);

  tempElem.select();
  document.execCommand("copy");
  document.body.removeChild(tempElem);
  alert("클립보드에 복사되었습니다.");
});
//  신청하기 버튼 클릭 이벤트
function fnApplyGame() {
  // 로그인 체크
  let isLoggedIn = document.getElementById("isLoggedIn").dataset.islogin;
  if (isLoggedIn === "true") {
    // 포인트 확인
    fnGetUserPoint();
  } else {
    alert("로그인이 필요합니다.");
    $("#loginModal").modal("show");
  }
  console.log("is logged in : ", isLoggedIn);
}
//  포인트 확인
function fnGetUserPoint() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/users/point", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      let user_point = res.point;
      document.getElementById(
        "user_point"
      ).value = new Intl.NumberFormat().format(res.point);
      let match_price = match_info.match_price;
      if (match_price < user_point) {
        $("#modalMatchConfirm").modal("show");
      } else {
        $("#modalMatchConfirm").modal("show");
      }
      console.log("match price : ", match_price);
    }
  };
  xhr.send();
}
// 매칭 신청 확인
function fnConfirmMatch() {
  let formData = {};
  let match_id = match_info._id;
  formData["match_id"] = match_id;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/match/apply", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.code === 1) {
        alert("정상적으로 신청했습니다.");
        $("#modalMatchConfirm").modal("hide");
      } else {
        alert(res.message);
      }
    }
  };
  xhr.send(JSON.stringify(formData));
}
