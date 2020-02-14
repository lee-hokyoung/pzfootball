$("input[data-origin]").on("keyup", function() {
  let origin = $(this).data("origin");
  let change = $(this).val();
  if (origin !== change) {
    $(this)
      .parent()
      .children("button")
      .removeClass("d-none");
  }
});
$("input[data-origin]").on("blur", function() {
  let inpObj = $(this);
  let origin = inpObj.data("origin");
  let id = inpObj.data("id");
  let change = inpObj.val();
  if (origin !== change) {
    let formData = { origin: origin, change: change, id: id };
    let match_id = match_info._id;
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/match/" + match_id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        console.log(
          $(this)
            .parent()
            .children("button")
            .children("i")
        );
        inpObj
          .parent()
          .children("button")
          .children("i")
          .attr("style", "color:green");
      }
    };
    xhr.send(JSON.stringify(formData));
    // $(this)
    //   .parent()
    //   .children("button")
    //   .removeClass("d-none");
  }
});
function fnUpdateMemberName(btn) {
  let origin = btn.parentElement.children[0].dataset.origin;
  let change = btn.parentElement.children[0].value;
  let formData = { origin: origin, change: change };
  let match_id = match_info._id;
  let xhr = new XMLHttpRequest();
  xhr.open("PUT", "/match/" + match_id, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert(res.message);
    }
  };
  xhr.send(JSON.stringify(formData));
}
