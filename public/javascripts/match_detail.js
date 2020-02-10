$("input[data-origin]").on("blur", function() {
  let origin = $(this).data("origin");
  let change = $(this).val();
  console.log("origin : ", origin, ", change : ", change);
  if (origin !== change) {
    $(this)
      .parent()
      .children("button")
      .removeClass("d-none");
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
