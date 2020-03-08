$(".detail-slider").slick({
  dots: true,
  arrows: false,
  fade: true
});
//  클립보드에 주소 복사
document.querySelector(".copy").addEventListener("click", function() {
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
}
// 포인트 확인
function fnGetUserPoint() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/users/point", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      let user_point = res.point || 0;
      document.getElementById(
        "user_point"
      ).value = new Intl.NumberFormat().format(user_point);
      let selectMember = document.getElementById("selectMember").value;
      let match_price = match_info.match_price * selectMember;
      document.getElementById(
        "require_point"
      ).value = new Intl.NumberFormat().format(match_price);
      let after_purchase = user_point - match_price;
      let inpAfterPurchase = document.getElementById("afterPurchase");
      inpAfterPurchase.value = new Intl.NumberFormat().format(after_purchase);
      if (after_purchase > 0) {
        document.getElementById("requireFooter").classList.add("d-none");
        $("#afterPurchase").addClass("bg-success");
      } else {
        document.getElementById("confirmFooter").classList.add("d-none");
        $("#afterPurchase").addClass("bg-danger");
      }
      $("#modalMatchConfirm").modal("show");
    }
  };
  xhr.send();
}
// 매칭 신청 확인
function fnConfirmMatch() {
  let formData = {};
  let match_id = match_info._id;
  formData["match_id"] = match_id;
  formData["member_cnt"] = Number($("#selectMember").val());
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/match/apply", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.code === 1) {
        alert("정상적으로 신청했습니다.");
        location.reload();
      } else {
        alert(res.message);
      }
    }
  };
  xhr.send(JSON.stringify(formData));
}
// 신청인원 수 조정 이벤트
$("#selectMember").on("change", function() {
  let user_point = Number(
    document.getElementById("user_point").value.replace(/[^0-9.-]+/g, "")
  );
  let member_cnt = $(this).val();
  let match_price = match_info.match_price * member_cnt;
  document.getElementById(
    "require_point"
  ).value = new Intl.NumberFormat().format(match_price);
  let afterPurchase = user_point - match_price;
  let inpAfterPurchase = document.getElementById("afterPurchase");
  inpAfterPurchase.value = new Intl.NumberFormat().format(afterPurchase);
  // 결제 후 포인트 잔여여부
  if (afterPurchase >= 0) {
    inpAfterPurchase.classList.remove("bg-danger");
    inpAfterPurchase.classList.add("bg-success");
    document.getElementById("confirmFooter").className = "modal-footer";
    document.getElementById("requireFooter").className = "modal-footer d-none";
  } else {
    inpAfterPurchase.classList.remove("bg-success");
    inpAfterPurchase.classList.add("bg-danger");
    document.getElementById("confirmFooter").className = "modal-footer d-none";
    document.getElementById("requireFooter").className = "modal-footer";
  }
});
// 포인트 충전 모달창 띄우기
function fnChargePoint() {
  $("#modalMatchConfirm").modal("hide");
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
}
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
