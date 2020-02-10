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
