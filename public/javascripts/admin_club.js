//  팀 삭제
function fnRemoveClub(id) {
  if (confirm("삭제하시면 복구할 수 없습니다. 삭제하시겠습니까?")) {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/admin/club/" + id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        console.log("res : ", res);
        alert(res.message);
        if (res.code === 1) location.reload();
      }
    };
    xhr.send();
  }
}
//  승인 모달 팝업 이벤트
document
  .querySelectorAll('button[name="btnApprovalModal"]')
  .forEach(function(btn) {
    btn.addEventListener("click", function() {
      //  팀 코드 중복 체크
      let team_code = this.parentElement.parentElement.querySelector(
        'input[name="team_code"]'
      );
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "/admin/club/duplication/" + team_code.value, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          let res = JSON.parse(this.response);
          if (res.code === 1) {
            let list = res.exCode.map(function(v) {
              return v.team_code;
            });
            let max;
            if (list.length > 0) {
              max = team_code.value + list.length.toString();
              // max =
              //   parseInt(
              //     list
              //       .sort(function(a, b) {
              //         return a < b ? 1 : -1;
              //       })[0]
              //       .substr(2)
              //   ) + 1;
            } else {
              max = team_code.value + "0";
            }
            document.querySelector(
              'input[name="team_code_approved"]'
            ).value = max;
            document.querySelector('button[name="btnApproval"]').dataset.id =
              btn.dataset.id;
            console.log(max);
            $("#modalApproval").modal("show");
          } else {
            alert(res.message);
          }
        }
      };
      xhr.send();
      //  코드 승인 모달창 팝업
    });
  });
//  팀 등록 승인
document
  .querySelector('button[name="btnApproval"]')
  .addEventListener("click", function() {
    let team_code = this.parentElement.parentElement.querySelector(
      'input[name="team_code_approved"]'
    );
    let club_id = this.dataset.id;
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/admin/club/approval", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        alert(res.message);
        if (res.code === 1) location.reload();
      }
    };
    xhr.send(JSON.stringify({ team_code: team_code.value, club_id: club_id }));
  });
