function fnAddRowRegion() {
  let tr = document.createElement("tr");
  //  첫번째 칼럼
  let td = document.createElement("td");
  tr.appendChild(td);
  //  두번째 칼럼
  td = document.createElement("td");
  let input = document.createElement("input");
  input.type = "text";
  input.placeholder = "지역명을 입력해주세요";
  input.className = "form-control";
  td.appendChild(input);
  tr.appendChild(td);
  //  세번째 칼럼
  td = document.createElement("td");
  let button = document.createElement("button");
  button.className = "btn btn-primary btn-sm btn-icon btn-icon-mini";
  button.type = "button";
  button.addEventListener("click", fnRemoveRow);
  let i = document.createElement("i");
  i.className = "nc-icon nc-simple-remove";
  button.appendChild(i);
  td.appendChild(button);
  tr.appendChild(td);
}
function fnRemoveRow() {
  console.log("remove row", this);
}
