function fnSubmitLoginPage() {
  let user_id = document.querySelector("#user_id");
  let user_pw = document.querySelector("#user_pw");
  if (user_id.value === "" || user_pw.value === "") return false;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/users/login", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.code === 1) {
        location.replace("/");
      } else {
        alert(res.message);
      }
    }
  };
  xhr.send(JSON.stringify({ user_id: user_id.value, user_pw: user_pw.value }));
  return false;
}
