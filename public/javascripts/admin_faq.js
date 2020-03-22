//  자주 묻는 질문 등록하기
document.querySelector("#register_faq").addEventListener("click", function() {
  let category = document.querySelector('select[name="category"]');
  let title = document.querySelector('input[name="title"]');
  let content = document.querySelector('textarea[name="content"]');
  let keyword = document.querySelector('input[name="keyword"]');
  if (category.value === "") {
    alert("카테고리를 선택해주세요");
    return false;
  }
  if (title.value === "") {
    alert("제목을 입력해 주세요");
    return false;
  }
  if (content.value === "") {
    alert("내용을 작성해 주세요");
    return false;
  }
  let formData = {};
  formData["category"] = category.value;
  formData["title"] = title.value;
  formData["content"] = content.value;
  formData["keyword"] = keyword.value;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/faq/register", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if ((this.readyState = XMLHttpRequest.DONE && this.status === 200)) {
      let res = JSON.parse(this.response);
    }
  };
  xhr.send(JSON.stringify(formData));
});
