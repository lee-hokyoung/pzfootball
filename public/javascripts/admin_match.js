function fnShowResultModal(id) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/admin/match/" + id);
  xhr.setRequestHeader("Content-Type", "application/json", true);
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      $("#resultModal").modal("show");
      $("#resultModal").data("id", id);
      console.log("res : ", res);
      // let winner_list = res.match_result.winner;
      // let loser_list = res.match_result.loser;
      let html = "",
        li_html = "";
      html += "<option value=''>mvp를 선택해 주세요</option>";
      res.apply_member.forEach(function(v, idx) {
        html +=
          '<option value="' +
          v._id +
          '"' +
          (res.mvp === v._id ? "selected" : "") +
          ">" +
          v.member +
          "</option>";
        li_html += "<li class='list-group-item'>";
        li_html += "<div class='row'>";
        li_html += "<div class='col-1'>" + (idx + 1);
        li_html += "</div>";
        li_html += "<div class='col-3'>" + v.member;
        li_html += "</div>";
        li_html += "<div class='col-8'>";

        li_html += '<div class="row">';
        for (var m = 0; m < parseInt(res.match_type); m++) {
          li_html += '<div class="col-4">';
          li_html +=
            '<div class="btn-group btn-group-toggle" data-toggle="buttons">';

          li_html += '<label class="btn btn-primary btn-link m-0 ';
          li_html += v.result ? (v.result[m] === "1" ? "active" : "") : "";
          li_html += '">';
          li_html +=
            '<input type="radio" autocomplete="off" value="1" data-id="' +
            v._id +
            '">승리';
          li_html += "</label>";

          li_html += '<label class="btn btn-danger btn-link m-0 ';
          li_html += v.result ? (v.result[m] === "0" ? "active" : "") : "";
          li_html += '">';
          li_html +=
            '<input type="radio" autocomplete="off" value="0" data-id="' +
            v._id +
            '">패배';
          li_html += "</label>";

          li_html += "</div>";
          li_html += "</div>";
        }

        li_html += "</div>";
        li_html += "</div>";
        li_html += "</li>";
      });
      document.querySelector("#mvp_user select").innerHTML = html;
      document.querySelector("#user_list").innerHTML = li_html;
    }
  };
  xhr.send();
}

//  경기결과 저장
function fnSaveResult() {
  let id = $("#resultModal").data("id");
  let mvp_id = document.querySelector("#mvp_user select");
  let data = document.querySelectorAll("label.active input");
  if (mvp_id.value === "") {
    alert("mvp 선수를 선택해주세요");
    return false;
  }
  let formData = {};
  data.forEach(function(v) {
    if (formData.hasOwnProperty(v.dataset.id)) {
      formData[v.dataset.id].push(v.value);
    } else {
      formData[v.dataset.id] = [v.value];
    }
  });
  formData["mvp_id"] = mvp_id.value;
  let xhr = new XMLHttpRequest();
  xhr.open("PUT", "/admin/match/result/" + id, true);
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
