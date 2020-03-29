function fnDeleteUser(user_id) {
  if (!confirm("삭제하시겠습니까?")) return false;
  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", "/admin/user/delete/" + user_id, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert(res.message);
      if (res.code === 1) location.reload();
    }
  };
  xhr.send();
}
