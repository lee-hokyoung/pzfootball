$("#wizard-picture").change(function() {
  readURL(this);
});
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $("#wizardPicturePreview")
        .attr("src", e.target.result)
        .fadeIn("slow");
    };
    reader.readAsDataURL(input.files[0]);
  }
}
//  내 정보(매니저 정보) 수정
function fnEditManager() {
  let formData = {};
  let manager_name = document.querySelector('input[name="manager_name"]');
  let manager_pw = document.querySelector('input[name="manager_pw"]');
  let gender = document.querySelector('input[name="gender"]:checked');
  let birth = document.querySelector('input[name="birth"]');
  let manager_phone = document.querySelector('input[name="manager_phone"]');
  let profile_image = document.querySelector("#wizardPicturePreview");
  if (manager_name.value === "") {
    alert("이름을 입력해 주세요");
    manager_name.focus();
    return false;
  }
  if (manager_pw.value === "") {
    alert("매니저 비밀번호를 입력해 주세요");
    manager_pw.focus();
    return false;
  }
  if (!gender) {
    alert("성별을 선택해 주세요");
    return false;
  }
  let xhr = new XMLHttpRequest();
  xhr.open("PUT", "/manager", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.code === 1) {
        alert("수정되었습니다.");
        location.reload();
      } else {
        alert(res.message);
        return false;
      }
    }
  };
  formData["manager_pw"] = manager_pw.value;
  formData["manager_name"] = manager_name.value;
  formData["gender"] = gender.value;
  formData["birth"] = birth.value;
  formData["manager_phone"] = manager_phone.value;
  if (profile_image) formData["profile_image"] = profile_image.src;
  xhr.send(JSON.stringify(formData));
}
