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
        li_html += "<div class='col-8'>";

        li_html += '<div class="row">';
        for (var m = 0; m < parseInt(res.match_type); m++) {
          li_html += '<div class="col-4">';
          li_html +=
            '<div class="btn-group btn-group-toggle" data-toggle="buttons">';

          li_html += '<label class="btn btn-primary btn-link m-0">';
          li_html += '<input type="radio" autocomplete="off">승리';
          li_html += "</label>";

          li_html += '<label class="btn btn-danger btn-link m-0">';
          li_html += '<input type="radio" autocomplete="off">패배';
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
