function findEmail() {
  let toMail = document.querySelector('input[name="email"]');
  if (toMail.value === "") {
    alert("메일을 입력해 주세요.");
    return false;
  }
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/mail/resetPw", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert(res.message);
      if (res.code === 1) location.reload();
    }
  };
  xhr.send(JSON.stringify({ email: toMail.value }));
}
