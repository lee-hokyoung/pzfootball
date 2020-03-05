//  테이블 로우 추가/삭제
function fnAddRowRegion() {
  let tr = document.createElement("tr");
  //  첫번째 칼럼
  let td = document.createElement("td");
  tr.appendChild(td);
  //  두번째 칼럼
  td = document.createElement("td");
  let input = document.createElement("input");
  input.type = "text";
  input.placeholder = "지역명을 입력해주세요";
  input.className = "form-control";
  td.appendChild(input);
  tr.appendChild(td);
  //  세번째 칼럼
  td = document.createElement("td");
  td.className = "text-center";
  let button = document.createElement("button");
  button.className = "btn btn-danger btn-sm btn-icon btn-icon-mini";
  button.type = "button";
  button.addEventListener("click", fnRemoveRow);
  button.tabIndex = -1;
  let i = document.createElement("i");
  i.className = "nc-icon nc-simple-remove";
  button.appendChild(i);
  td.appendChild(button);
  tr.appendChild(td);

  let tbody = document.querySelector("tbody");
  tbody.appendChild(tr);
}
function fnRemoveRow() {
  this.parentElement.parentElement.remove();
}

//  신규 테이블 로우 저장
function fnSaveRegion() {
  let list = [];
  document.querySelectorAll("#region-card input").forEach(function(v) {
    if (v.value !== "") list.push({ name: v.value });
  });
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/config/region", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert(res.message);
      if (res.code === 1) location.reload();
    }
  };
  xhr.send(JSON.stringify({ data: list }));
}
//  지역명 수정
document.querySelectorAll('button[data-role="edit"]').forEach(function(v) {
  v.addEventListener("click", function() {
    let this_tr = this.parentElement.parentElement;
    let td = this_tr.querySelector("td[data-status]");
    let status = td.dataset.status;
    let child_i = this.childNodes[0];
    if (status === "read") {
      //  수정모드로 변환(input 엘리멘트 넣기)
      let input = document.createElement("input");
      input.type = "text";
      input.value = td.innerText;
      input.className = "form-control";
      td.dataset.status = "edit";
      td.innerHTML = "";
      td.appendChild(input);
      child_i.className = "nc-icon nc-ruler-pencil text-success";
    } else {
      let val = this_tr.querySelector("input").value;
      let xhr = new XMLHttpRequest();
      xhr.open("PATCH", "/admin/config/region", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          let res = JSON.parse(this.response);
          if (res.code === 1) {
            td.innerHTML = val;
            td.dataset.status = "read";
            child_i.className = "nc-icon nc-ruler-pencil";
          }
        }
      };
      xhr.send(JSON.stringify({ id: this_tr.dataset.id, val: val }));
    }
    console.log(this);
  });
});
//  지역명 삭제
document.querySelectorAll('button[data-role="remove"]').forEach(function(v) {
  v.addEventListener("click", function() {
    if (confirm("삭제하시면 복구할 수 없습니다. 계속하시겠습니까?")) {
      let this_tr = this.parentElement.parentElement;
      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", "/admin/config/region", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          let res = JSON.parse(this.response);
          if (res.code === 1) {
            location.reload();
          }
        }
      };
      xhr.send(JSON.stringify({ id: this_tr.dataset.id }));
    }
  });
});
