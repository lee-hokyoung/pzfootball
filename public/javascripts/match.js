$(function() {
  // 경기시간 설정
  $("#matchTime").datetimepicker({
    format: "HH:mm", //use this format if you want the 12hours timpiecker with AM/PM toggle
    icons: {
      time: "fa fa-clock-o",
      date: "fa fa-calendar",
      up: "fa fa-chevron-up",
      down: "fa fa-chevron-down",
      previous: "fa fa-chevron-left",
      next: "fa fa-chevron-right",
      today: "fa fa-screenshot",
      clear: "fa fa-trash",
      close: "fa fa-remove"
    },
    stepping: 15
  });
});
// 경기장 선택 이벤트
// $("#selectGround").on("change", function(v) {
//   let groundInfo = fnGetGroundInfo(v.currentTarget.value);
// });
// function fnGetGroundInfo(id) {
//   let xhr = new XMLHttpRequest();
//   xhr.open("GET", "/admin/ground/read/" + id, true);
//   xhr.setRequestHeader("Content-Type", "application/json");
//   xhr.onreadystatechange = function() {
//     if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
//       let res = JSON.parse(this.response);
//       console.log("res : ", res);
//     }
//   };
//   xhr.send();
// }
// 날짜선택 버튼 클릭 이벤트
$("#selectDateBtn button").on("click", function(btn) {
  // 클릭시 색 변경
  // document.querySelectorAll("#selectDateBtn button").forEach(function(v) {
  //   v.classList.remove("btn-primary");
  // });
  let currentBtn = btn.currentTarget;
  // currentBtn.classList.add("btn-primary");
  let selectedGround = document.querySelector("#selectGround");
  if (selectedGround.value === "") {
    alert("경기장을 선택해 주세요");
    return false;
  }
  let date = currentBtn.dataset.date;
  location.href = "/admin/match/register/" + date + "/" + selectedGround.value;
});

// 경기장 등록
$("#registerMatch").on("click", function(btn) {
  let row = btn.currentTarget.parentElement.parentElement;
  fnGenerateRow(row);
});
function fnGenerateRow(item) {
  let ground_id = document.querySelector("#selectGround");
  let match_date = document.querySelector("#selectDateBtn .btn-warning");
  if (!match_date) {
    alert("경기일을 선택해주세요.");
    return false;
  }
  let match_time = item.querySelector("#matchTime");
  let match_type = item.querySelector('input[name="match_type"]:checked');
  let ladder = item.querySelector('input[name="ladder"]');
  let match_grade = item.querySelector('input[name="match_grade"]:checked');
  let sex = item.querySelector('input[name="sex"]:checked');
  let personnel_min = item.querySelector('input[name="personnel-min"]');
  let personnel_max = item.querySelector('input[name="personnel-max"]');
  let match_price = item.querySelector('input[name="match_price"]');

  // 유효성 검증
  if (ground_id.value === "") {
    alert("경기장을 선택해주세요");
    ground_id.focus();
    return false;
  }
  if (match_time.value === "") {
    alert("시간을 입력해 주세요");
    match_time.focus();
    return false;
  }
  if (match_type === null || match_type.value === "") {
    alert("경기 타입을 선택해 주세요");
    return false;
  }
  if (match_grade === null || match_grade.value === "") {
    alert("실력을 선택해 주세요");
    return false;
  }
  if (sex === null || sex.value === "") {
    alert("성별을 선택해 주세요");
    return false;
  }
  if (personnel_min.value === "" || personnel_max.value === "") {
    alert("인원수를 입력해 주세요");
    return false;
  }
  if (match_price.value === "") {
    alert("금액을 입력해 주세요");
    match_price.focus();
    return false;
  }
  let formData = {};
  formData["ground_id"] = ground_id.value;
  formData["match_date"] = document.querySelector(
    "button.btn-warning"
  ).dataset.date;
  formData["match_time"] = match_time.value;
  formData["match_type"] = match_type.value;
  formData["match_grade"] = match_grade.value;
  formData["ladder"] = ladder.checked ? 1 : 0;
  formData["sex"] = sex.value;
  formData["personnel"] = {
    min: Number(personnel_min.value),
    max: Number(personnel_max.value)
  };
  formData["match_price"] = match_price.value;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/match/register", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      fnSetNewRow(res);
    } else {
      return false;
    }
  };
  xhr.send(JSON.stringify(formData));
}

function fnSetNewRow(doc) {
  let _id = doc._id;
  let match_time = doc.match_time;
  let match_type = doc.match_type;
  let match_grade = doc.match_grade;
  let ladder = doc.ladder;
  let sex = doc.sex;
  let personnel = doc.personnel;
  let match_price = doc.match_price;

  let li = document.createElement("li");
  li.className = "list-group-item";
  let row = document.createElement("div");
  row.className = "row";
  // 첫번째 컬럼 #
  let col_1 = document.createElement("div");
  col_1.className = "col";
  col_1.dataset.title = "#";
  // 두번째 컬럼(시간)
  let col_2 = document.createElement("div");
  col_2.className = "col";
  col_2.dataset.title = "match_time";
  let formGroup = document.createElement("div");
  let input = document.createElement("input");
  input.className = "form-control py-1";
  input.setAttribute("type", "text");
  input.setAttribute("name", "match_time");
  // input.readOnly = true;
  input.value = match_time;
  formGroup.appendChild(input);
  col_2.appendChild(formGroup);
  // 세번째 컬럼 타입(2파전, 3파전, 승점제경기 유무)
  let col_3 = document.createElement("div");
  col_3.className = "col";
  col_3.dataset.title = "match_type";
  ["2", "3"].forEach(function(v) {
    formGroup = document.createElement("div");
    formGroup.className = "form-check-radio form-check-inline";
    let label = document.createElement("label");
    label.className = "form-check-label";
    input = document.createElement("input");
    input.className = "form-check-input";
    input.setAttribute("type", "radio");
    input.setAttribute("name", "match_type_" + _id);
    // input.setAttribute("disabled", true);
    if (match_type === v) input.checked = true;
    input.value = v;
    let span = document.createElement("span");
    span.className = "form-check-sign";
    span.innerText = v === "2" ? "2파전" : "3파전";
    label.appendChild(input);
    label.appendChild(span);
    formGroup.appendChild(label);
    col_3.appendChild(formGroup);
  });
  formGroup = document.createElement("div");
  formGroup.className = "form-check form-check-inline";
  let label = document.createElement("label");
  label.className = "form-check-label";
  input = document.createElement("input");
  input.className = "form-check-input";
  input.setAttribute("type", "checkbox");
  input.setAttribute("name", "ladder");
  input.checked = ladder === 1;
  let span = document.createElement("span");
  span.className = "form-check-sign";
  span.innerText = "승점제 경기";
  label.appendChild(input);
  label.appendChild(span);
  formGroup.appendChild(label);
  col_3.appendChild(formGroup);
  // 네번째 컬럼(실력: 상, 중, 하)
  let col_4 = document.createElement("div");
  col_4.className = "col";
  col_4.dataset.title = "match_grade";
  [
    { lbl: "상", val: "1" },
    { lbl: "중", val: "2" },
    { lbl: "하", val: "3" }
  ].forEach(function(v) {
    formGroup = document.createElement("div");
    formGroup.className = "form-check-radio form-check-inline";
    label = document.createElement("label");
    label.className = "form-check-label";
    input = document.createElement("input");
    input.className = "form-check-input";
    input.setAttribute("type", "radio");
    input.setAttribute("name", "match_grade_" + _id);
    input.setAttribute("value", v.val);
    // input.setAttribute("disabled", true);
    if (match_grade === v.val) input.checked = true;
    span = document.createElement("span");
    span.className = "form-check-sign";
    span.innerText = v.lbl;
    label.appendChild(input);
    label.appendChild(span);
    formGroup.appendChild(label);
    col_4.appendChild(formGroup);
  });
  // 다섯번째 컬럼(성별)
  let col_5 = document.createElement("div");
  col_5.className = "col";
  col_5.dataset.title = "sex";
  [
    { lbl: "남성", val: 1 },
    { lbl: "여성", val: -1 },
    { lbl: "혼성", val: 0 }
  ].forEach(function(v) {
    formGroup = document.createElement("div");
    formGroup.className = "form-check-radio form-check-inline";
    label = document.createElement("label");
    label.className = "form-check-label";
    input = document.createElement("input");
    input.className = "form-check-input";
    input.setAttribute("type", "radio");
    input.setAttribute("name", "sex_" + _id);
    input.setAttribute("value", v.val);
    // input.setAttribute("disabled", true);
    if (sex === v.val) input.checked = true;
    span = document.createElement("span");
    span.className = "form-check-sign";
    span.innerText = v.lbl;
    label.appendChild(input);
    label.appendChild(span);
    formGroup.appendChild(label);
    col_5.appendChild(formGroup);
  });
  // 여섯번째 컬럼(인원수)
  let col_6 = document.createElement("div");
  col_6.className = "col";
  col_6.dataset.title = "psersonnel";
  formGroup = document.createElement("div");
  formGroup.className = "form-group";
  input = document.createElement("input");
  input.className = "form-control py-1";
  input.setAttribute("type", "text");
  input.setAttribute("name", "personnel-min");
  input.value = personnel.min;
  formGroup.appendChild(input);
  span = document.createElement("span");
  span.innerText = " ~ ";
  formGroup.appendChild(span);
  input = document.createElement("input");
  input.className = "form-control py-1";
  input.setAttribute("type", "text");
  input.setAttribute("name", "personnel-max");
  input.value = personnel.max;
  formGroup.appendChild(input);
  col_6.appendChild(formGroup);
  // 일곱번째 컬럼(금액)
  let col_7 = document.createElement("div");
  col_7.className = "col";
  col_7.dataset.title = "match_price";
  formGroup = document.createElement("div");
  formGroup.className = "form-group";
  input = document.createElement("input");
  input.className = "form-control py-1";
  input.setAttribute("type", "text");
  input.setAttribute("name", "match_price");
  input.value = match_price;
  // input.readOnly = true;
  formGroup.appendChild(input);
  col_7.appendChild(formGroup);
  // 여덟번째 컬럼
  let col_8 = document.createElement("div");
  col_8.className = "col";
  col_8.dataset.title = "buttons";

  row.appendChild(col_1);
  row.appendChild(col_2);
  row.appendChild(col_3);
  row.appendChild(col_4);
  row.appendChild(col_5);
  row.appendChild(col_6);
  row.appendChild(col_7);
  row.appendChild(col_8);
  li.appendChild(row);

  let match_list = document.querySelector("#match_list");
  match_list.appendChild(li);
}

// 경기장 수정
function fnUpdate(_id) {
  let r = document.querySelector('.row[data-id="' + _id + '"]');
  let idx = r.querySelector(".col").innerText;
  let match_time = r.querySelector("div[name='match_time']").innerText;
  let match_type = r.querySelector("div[name='match_type']").dataset.value;
  let match_grade = r.querySelector("div[name='match_grade']").dataset.value;
  let sex = r.querySelector("div[name='sex']").dataset.value;
  let personnel = r.querySelector("div[name='personnel']");
  let match_price = r.querySelector("div[name='match_price']").innerText;
  let ladder = r.querySelector("input").value;

  // 첫번째 컬럼 #
  let col_1 = document.createElement("div");
  col_1.className = "col";
  col_1.dataset.title = "#";
  col_1.innerText = idx;
  // 두번째 컬럼(시간)
  let col_2 = document.createElement("div");
  col_2.className = "col";
  col_2.dataset.title = "match_time";
  let formGroup = document.createElement("div");
  let input = document.createElement("input");
  input.className = "form-control py-1";
  input.setAttribute("type", "text");
  input.setAttribute("name", "match_time");
  // input.readOnly = true;
  input.value = match_time;
  formGroup.appendChild(input);
  col_2.appendChild(formGroup);
  // 세번째 컬럼 타입(2파전, 3파전, 승점제경기 유무)
  let col_3 = document.createElement("div");
  col_3.className = "col";
  col_3.dataset.title = "match_type";
  ["2", "3"].forEach(function(v) {
    formGroup = document.createElement("div");
    formGroup.className = "form-check-radio form-check-inline";
    let label = document.createElement("label");
    label.className = "form-check-label";
    input = document.createElement("input");
    input.className = "form-check-input";
    input.setAttribute("type", "radio");
    input.setAttribute("name", "match_type_" + _id);
    // input.setAttribute("disabled", true);
    if (match_type === v) input.checked = true;
    input.value = v;
    let span = document.createElement("span");
    span.className = "form-check-sign";
    span.innerText = v === "2" ? "2파전" : "3파전";
    label.appendChild(input);
    label.appendChild(span);
    formGroup.appendChild(label);
    col_3.appendChild(formGroup);
  });
  formGroup = document.createElement("div");
  formGroup.className = "form-check form-check-inline";
  let label = document.createElement("label");
  label.className = "form-check-label";
  input = document.createElement("input");
  input.className = "form-check-input";
  input.setAttribute("type", "checkbox");
  input.setAttribute("name", "ladder");
  input.checked = ladder === "1";
  let span = document.createElement("span");
  span.className = "form-check-sign";
  span.innerText = "승점제 경기";
  label.appendChild(input);
  label.appendChild(span);
  formGroup.appendChild(label);
  col_3.appendChild(formGroup);
  // 네번째 컬럼(실력: 상, 중, 하)
  let col_4 = document.createElement("div");
  col_4.className = "col";
  col_4.dataset.title = "match_grade";
  [
    { lbl: "상", val: "1" },
    { lbl: "중", val: "2" },
    { lbl: "하", val: "3" }
  ].forEach(function(v) {
    formGroup = document.createElement("div");
    formGroup.className = "form-check-radio form-check-inline";
    label = document.createElement("label");
    label.className = "form-check-label";
    input = document.createElement("input");
    input.className = "form-check-input";
    input.setAttribute("type", "radio");
    input.setAttribute("name", "match_grade_" + _id);
    input.setAttribute("value", v.val);
    // input.setAttribute("disabled", true);
    if (match_grade === v.val) input.checked = true;
    span = document.createElement("span");
    span.className = "form-check-sign";
    span.innerText = v.lbl;
    label.appendChild(input);
    label.appendChild(span);
    formGroup.appendChild(label);
    col_4.appendChild(formGroup);
  });
  // 다섯번째 컬럼(성별)
  let col_5 = document.createElement("div");
  col_5.className = "col";
  col_5.dataset.title = "sex";
  [
    { lbl: "남성", val: "1" },
    { lbl: "여성", val: "-1" },
    { lbl: "혼성", val: "0" }
  ].forEach(function(v) {
    formGroup = document.createElement("div");
    formGroup.className = "form-check-radio form-check-inline";
    label = document.createElement("label");
    label.className = "form-check-label";
    input = document.createElement("input");
    input.className = "form-check-input";
    input.setAttribute("type", "radio");
    input.setAttribute("name", "sex_" + _id);
    input.setAttribute("value", v.val);
    // input.setAttribute("disabled", true);
    if (sex === v.val) input.checked = true;
    span = document.createElement("span");
    span.className = "form-check-sign";
    span.innerText = v.lbl;
    label.appendChild(input);
    label.appendChild(span);
    formGroup.appendChild(label);
    col_5.appendChild(formGroup);
  });
  // 여섯번째 컬럼(인원수)
  let col_6 = document.createElement("div");
  col_6.className = "col";
  col_6.dataset.title = "personnel";
  formGroup = document.createElement("div");
  formGroup.className = "form-group";
  input = document.createElement("input");
  input.className = "form-control py-1";
  input.setAttribute("type", "text");
  input.setAttribute("name", "personnel-min");
  input.value = personnel.dataset.min;
  formGroup.appendChild(input);
  span = document.createElement("span");
  span.innerText = " ~ ";
  formGroup.appendChild(span);
  input = document.createElement("input");
  input.className = "form-control py-1";
  input.setAttribute("type", "text");
  input.setAttribute("name", "personnel-max");
  input.value = personnel.dataset.max;
  formGroup.appendChild(input);
  col_6.appendChild(formGroup);
  // 일곱번째 컬럼(금액)
  let col_7 = document.createElement("div");
  col_7.className = "col";
  col_7.dataset.title = "match_price";
  formGroup = document.createElement("div");
  formGroup.className = "form-group";
  input = document.createElement("input");
  input.className = "form-control py-1";
  input.setAttribute("type", "text");
  input.setAttribute("name", "match_price");
  input.value = match_price;
  // input.readOnly = true;
  formGroup.appendChild(input);
  col_7.appendChild(formGroup);
  // 여덟번째 컬럼
  let col_8 = document.createElement("div");
  col_8.className = "col";
  col_8.dataset.title = "buttons";
  let button = document.createElement("button");
  button.className = "btn btn-sm btn-success m-0 btn-link";
  button.setAttribute("title", "수정");
  button.addEventListener("click", function() {
    let updateForm = {};
    let target_row = document.querySelector('.row[data-id="' + _id + '"]');
    updateForm["match_time"] = target_row.querySelector(
      'input[name="match_time"]'
    ).value;
    updateForm["match_type"] = target_row.querySelector(
      'input[name="match_type_' + _id + '"]:checked'
    ).value;
    updateForm["ladder"] = target_row.querySelector('input[name="ladder"]')
      .checked
      ? 1
      : 0;
    updateForm["match_grade"] = target_row.querySelector(
      'input[name="match_grade_' + _id + '"]:checked'
    ).value;
    updateForm["sex"] = target_row.querySelector(
      'input[name="sex_' + _id + '"]:checked'
    ).value;
    updateForm["personnel"] = {
      min: target_row.querySelector('input[name="personnel-min"]').value,
      max: target_row.querySelector('input[name="personnel-max"]').value
    };
    // target_row.querySelector('input[name="personnel"]').value;
    updateForm["match_price"] = target_row.querySelector(
      'input[name="match_price"]'
    ).value;

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/admin/match/" + _id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        alert("정상적으로 수정되었습니다");
        // location.reload();
      } else {
        return false;
      }
    };
    xhr.send(JSON.stringify(updateForm));
  });
  let icon = document.createElement("i");
  icon.className = "fa fa-check";
  button.appendChild(icon);
  col_8.appendChild(button);

  button = document.createElement("button");
  button.className = "btn btn-sm btn-danger m-0 btn-link";
  button.setAttribute("title", "취소");
  button.addEventListener("click", function() {
    fnDelete(_id);
  });
  icon = document.createElement("i");
  icon.className = "fa fa-times";
  button.appendChild(icon);
  col_8.appendChild(button);

  r.innerHTML = "";
  r.appendChild(col_1);
  r.appendChild(col_2);
  r.appendChild(col_3);
  r.appendChild(col_4);
  r.appendChild(col_5);
  r.appendChild(col_6);
  r.appendChild(col_7);
  r.appendChild(col_8);
}
function fnDelete(id) {
  if (confirm("삭제하면 복구할 수 없습니다. 계속하시겠습니까?")) {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/admin/match/" + id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        fnDeleteRow(id);
        alert("정상적으로 삭제되었습니다");
      } else {
        return false;
      }
    };
    xhr.send();
  }
}
function fnDeleteRow(id) {
  document.querySelector('div[data-id="' + id + '"]').parentNode.remove();
}
