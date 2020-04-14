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
  });
  let table = $("#datatable").DataTable();
  //  소속 필터링
  document
    .querySelector('select[name="depart"]')
    .addEventListener("change", function () {
      var regExSearch = "^" + this.value + "$";
      if (this.value === "") regExSearch = this.value;
      table.column(eCol.depart).search(regExSearch, true, false, true).draw();
    });
  document
    .querySelector('select[name="role"]')
    .addEventListener("change", function () {
      var regExSearch = "^" + this.value + "$";
      if (this.value === "") regExSearch = this.value;
      table.column(eCol.role).search(regExSearch, true, false, true).draw();
    });
});
