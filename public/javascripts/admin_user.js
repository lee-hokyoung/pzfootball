//  누적 캐시 클릭 이벤트
document.querySelectorAll('a[data-role="pointHistory"]').forEach(function (a) {
  a.addEventListener("click", function () {
    let user_id = this.dataset.id;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/admin/user/pointHistory/" + user_id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        if (res.code === 1) {
          let point_history = res.result;
          let tbody = document.querySelector("#pointHistoryModal tbody");
          tbody.innerHTML = "";
          point_history.forEach(function (v, idx) {
            let tr = document.createElement("tr");
            // no
            let td = document.createElement("td");
            td.innerText = idx + 1;
            tr.appendChild(td);
            // 충전 방식
            td = document.createElement("td");
            td.innerText =
              v.chargeType === "account"
                ? "무통장입금"
                : v.chargeType === "realtime"
                ? "실시간 계좌이체"
                : v.chargeType === "credit"
                ? "신용카드"
                : v.chargeType === "kakao"
                ? "카카오페이"
                : "";
            tr.appendChild(td);
            // 충전 포인트
            td = document.createElement("td");
            td.innerText = Intl.NumberFormat().format(v.chargePoint);
            tr.appendChild(td);
            // 사용 포인트
            td = document.createElement("td");
            td.innerText = Intl.NumberFormat().format(v.usePoint || 0);
            tr.appendChild(td);
            // 사용 쿠폰
            td = document.createElement("td");
            if (v.coupon_info.length > 0) {
              td.innerText =
                v.coupon_info[0].cp_name +
                " (" +
                Intl.NumberFormat().format(v.coupon_info[0].cp_point) +
                ")";
            } else {
              td.innerText = 0;
            }
            tr.appendChild(td);
            // 환불 포인트
            td = document.createElement("td");
            td.innerText = Intl.NumberFormat().format(v.refundPoint || 0);
            tr.appendChild(td);
            // 시간
            td = document.createElement("td");
            let date = new Date(v.created_at);
            td.innerText = date.toLocaleString("kr");
            tr.appendChild(td);
            tbody.appendChild(tr);
          });
          $("#pointHistoryModal").modal("show");
        } else {
          alert(res.message);
        }
      }
    };
    xhr.send();
  });
});
//  회원 삭제
function fnDeleteUser(user_id) {
  if (!confirm("삭제하시겠습니까?")) return false;
  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", "/admin/user/delete/" + user_id, true);
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
//  환불요청
document.querySelectorAll('a[data-role="pointRefund"]').forEach(function (a) {
  a.addEventListener("click", function () {
    document.querySelector('input[name="pointRefund"]').value = a.dataset.value || 0;
    document.querySelector('input[name="refund_user_id"]').value = a.dataset.id;
    $("#refundPointModal").modal("show");
  });
});
//  환불 승인
function refundPoint() {
  let refundPoint = document.querySelector('input[name="pointRefund"]');
  let user_id = document.querySelector('input[name="refund_user_id"]').value;
  if (refundPoint.value !== "" && refundPoint.value > 0) {
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", "/admin/user/refundPoint", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        alert(res.message);
        if (res.code === 1) location.reload();
      }
    };
    xhr.send(JSON.stringify({ user_id: user_id, refundPoint: refundPoint.value }));
  } else {
    alert("포인트를 입력하세요");
    return false;
  }
}
//  datatable 설정
document.addEventListener("DOMContentLoaded", function () {
  let eCol = {
    no: 0,
    depart: 1,
    user_id: 2,
    user_name: 3,
    user_phone: 4,
    use_number: 5,
    role: 6,
    accumulate_cash: 7,
    possesion_cash: 8,
    manner: 9,
    mvp_number: 10,
    created_at: 11,
    user_info: 12,
  };
  //  DataTable 설정
  let dataTable = $("#datatable");
  dataTable.DataTable({
    columnDefs: [
      { orderable: true, targets: eCol.no },
      { orderable: false, targets: eCol.depart },
      { orderable: false, targets: eCol.user_id },
      { orderable: false, targets: eCol.user_name },
      { orderable: false, targets: eCol.user_phone },
      { orderable: false, targets: eCol.use_number },
      { orderable: false, targets: eCol.role },
      { orderable: false, targets: eCol.accumulate_cash },
      { orderable: false, targets: eCol.possesion_cash },
      { orderable: false, targets: eCol.manner },
      { orderable: false, targets: eCol.mvp_number },
      { orderable: true, targets: eCol.created_at },
      { orderable: false, targets: eCol.user_info },
    ],
    bInfo: false,
  });
  let table = $("#datatable").DataTable();
  //  소속 필터링
  document.querySelector('select[name="depart"]').addEventListener("change", function () {
    var regExSearch = "^" + this.value + "$";
    if (this.value === "") regExSearch = this.value;
    table.column(eCol.depart).search(regExSearch, true, false, true).draw();
  });
  //  직책 필터링(주장, 공동주장, 팀원)
  document.querySelector('select[name="role"]').addEventListener("change", function () {
    var regExSearch = "^" + this.value + "$";
    if (this.value === "") regExSearch = this.value;
    table.column(eCol.role).search(regExSearch, true, false, true).draw();
  });
  document.querySelector('select[name="useNumber"]').addEventListener("change", function () {
    if (this.value !== "") location.href = "/admin/user/list?ladder=" + this.value;
    else location.href = "/admin/user/list";
  });
});
