//  필터링 설정 적용하기 클릭 이벤트 -> 필요없는 기능이 됨.
function fnSetFilter() {
  let form = document.createElement("form");
  form.method = "POST";
  form.action = "/filter";
  let gender_list = [];
  let skill_list = [];
  let region_list = [];
  document.querySelectorAll(".btn-wrap .btn-light.active").forEach(function (v) {
    if (v.name === "gender") gender_list.push(v.value);
    else if (v.name === "skill") skill_list.push(v.value);
    else if (v.name === "region") region_list.push(v.value);
  });
  let field = document.createElement("input");
  field.type = "hidden";
  field.name = "gender";
  field.value = gender_list.join(",");
  form.appendChild(field);

  field = document.createElement("input");
  field.type = "hidden";
  field.name = "skill";
  field.value = skill_list.join(",");
  form.appendChild(field);

  if (document.querySelector('button[data-target="#myRegion"]').getAttribute("aria-expanded") === "true") {
    field = document.createElement("input");
    field.type = "hidden";
    field.name = "region";
    field.value = region_list.join(",");
    form.appendChild(field);
  }
  if (isLoggedIn) {
    if (document.querySelector('button[data-target="#myGround"]').getAttribute("aria-expanded") === "true") {
      field = document.createElement("input");
      field.type = "hidden";
      field.name = "ground";
      field.value = document.querySelector('input[name="myGround"]').value;
      form.appendChild(field);
    }
  }
  console.log("form : ", form);
  document.body.appendChild(form);
  form.submit();
}
