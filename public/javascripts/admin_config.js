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

//  공지사항
//  새 글 등록 모달 띄우기
document
  .querySelector('button[data-role="notice-upload"]')
  .addEventListener("click", function() {
    //  image 파일 등록 여부 확인
    let notice_img = document.querySelector(
      "#modalNoticeWrite .fileinput-preview img"
    );
    if (!notice_img) {
      alert("이미지를 등록해주세요");
      return false;
    }
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/admin/config/notice", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        alert(res.message);
        if (res.code === 1) location.reload();
      }
    };
    xhr.send(JSON.stringify({ notice_img: notice_img.src }));
  });
//  공지사항 글 수정
document
  .querySelectorAll('button[data-role="editNotice"]')
  .forEach(function(btn) {
    btn.addEventListener("click", function() {
      let id = this.dataset.id;
      let notice_img = document.querySelector(
        "#modalNoticeWrite .fileinput-preview img"
      );
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "/admin/config/notice/" + id);
      xhr.setRequestHeader("Content-Type", "application/json", true);
      xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          let res = JSON.parse(this.response);
          if (res.code === 1) {
            //  모달창 띄우기
            let item = res.result;
            notice_img.src = item.notice_img;
            $("#modalNoticeWrite").modal("show");
          } else {
            alert(res.message);
            return false;
          }
        }
      };
      xhr.send();
    });
  });
//  공지사항 글 삭제
document
  .querySelectorAll('button[data-role="removeNotice"]')
  .forEach(function(btn) {
    btn.addEventListener("click", function() {
      if (!confirm("삭제하시겠습니까?")) return false;
      let id = this.dataset.id;
      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", "/admin/config/notice/" + id, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          let res = JSON.parse(this.response);
          alert(res.message);
          if (res.code === 1) location.reload();
        }
      };
      xhr.send();
    });
  });
//  공지사항 등록 활성화/비활성화
document
  .querySelectorAll('button[data-role="activeNotice"]')
  .forEach(function(btn) {
    btn.addEventListener("click", function() {
      let id = this.dataset.id;
      let toggle = this.dataset.toggle;
      let activityLabel = "활성화";
      if (toggle === "true") activityLabel = "비활성화";
      if (!confirm("해당 공지를 " + activityLabel + "하시겠습니까?"))
        return false;
      this.dataset.toggle = toggle === "false";
      let xhr = new XMLHttpRequest();
      xhr.open("PUT", "/admin/config/notice", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          let res = JSON.parse(this.response);
          alert(res.message);
        }
      };
      xhr.send(JSON.stringify({ id: id, activity: this.dataset.toggle }));
    });
  });
//  매너점수 플러스 버튼 클릭 이벤트
document
  .querySelector('button[name="btnAddRowManner"]')
  .addEventListener("click", function() {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let input = document.createElement("input");
    input.className = "form-control";
    input.setAttribute("type", "text");
    input.setAttribute("name", "manner-title");
    td.appendChild(input);
    tr.appendChild(td);

    td = document.createElement("td");
    input = document.createElement("input");
    input.className = "form-control";
    input.setAttribute("type", "text");
    input.setAttribute("name", "manner-point");
    td.appendChild(input);
    tr.appendChild(td);

    td = document.createElement("td");
    button = document.createElement("button");
    button.className = "btn btn-danger btn-sm btn-icon btn-icon-mini";
    button.setAttribute("type", "button");
    button.setAttribute("name", "removeMannerRow");
    button.addEventListener("click", function() {
      this.parentElement.parentElement.remove();
    });
    let i = document.createElement("i");
    i.className = "nc-icon nc-simple-remove";
    button.appendChild(i);
    td.appendChild(button);
    tr.appendChild(td);

    document.querySelector("#manner-table tbody").appendChild(tr);
  });
//  매너 점수 저장
function fnSaveManner() {
  let list = [];
  document.querySelectorAll("#manner-table tbody tr").forEach(function(v) {
    let title = v.querySelector('input[name="manner-title"]');
    let point = v.querySelector('input[name="manner-point"]');
    if (title.value !== "" && point.value !== "") {
      list.push({ title: title.value, point: point.value });
    }
  });
  console.log("list : ", list);
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/config/manner", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert(res.message);
      if (res.code === 1) location.reload();
    }
  };
  xhr.send(JSON.stringify(list));
}
//  매너 항목 삭제
document.querySelectorAll('button[name="removeManner"]').forEach(function(btn) {
  btn.addEventListener("click", function() {
    if (!confirm("삭제하시겠습니까?")) return false;
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/admin/config/manner/" + this.dataset.id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        alert(res.message);
        if (res.code === 1) btn.parentElement.parentElement.remove();
      }
    };
    xhr.send();
  });
});
