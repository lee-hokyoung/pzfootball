function fnShowResultModal(id) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/admin/match/" + id);
  xhr.setRequestHeader("Content-Type", "application/json", true);
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      $("#resultModal").modal("show");
    }
  };
  xhr.send();
}
