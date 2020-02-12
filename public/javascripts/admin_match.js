function fnShowResultModal(id) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/admin/match/" + id);
  xhr.setRequestHeader("Content-Type", "application/json", true);
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      $("#resultModal").modal("show");
      console.log("res : ", res);
      let winner_list = res.match_result.winner;
      let loser_list = res.match_result.loser;
      let html = "",
        li_html = "";
      res.apply_member.forEach(function(v, idx) {
        html += '<option value="' + v.member + '">' + v.member + "</option>";
        li_html += "<li class='list-group-item'>";
        li_html += "<div class='row'>";
        li_html += "<div class='col-1'>" + (idx + 1);
        li_html += "</div>";
        li_html += "<div class='col-3'>" + v.member;
        li_html += "</div>";
        li_html += "<div class='col-4'>";
        li_html +=
          winner_list.indexOf(v.member) > -1
            ? "승리"
            : loser_list.indexOf(v.meber) > -1
            ? "패배"
            : "";
        li_html += "</div>";
        li_html += "<div class='col-4 d-flex justify-content-start'>";
        li_html += "<button class='btn btn-link btn-primary'>승리";
        li_html += "</button>";
        li_html += "<button class='btn btn-link btn-danger'>패배";
        li_html += "</button>";
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
