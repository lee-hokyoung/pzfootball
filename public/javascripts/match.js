$(function(){
  // 경기시간 설정
  $('#matchTime').datetimepicker({
    format: 'HH:mm', //use this format if you want the 12hours timpiecker with AM/PM toggle
    icons: {
      time: "fa fa-clock-o",
      date: "fa fa-calendar",
      up: "fa fa-chevron-up",
      down: "fa fa-chevron-down",
      previous: 'fa fa-chevron-left',
      next: 'fa fa-chevron-right',
      today: 'fa fa-screenshot',
      clear: 'fa fa-trash',
      close: 'fa fa-remove'
    },
    stepping:15
  });
});
// 경기장 선택 이벤트
$('#selectGround').on('change', function(v){
  let groundInfo = fnGetGroundInfo(v.currentTarget.value);
});
function fnGetGroundInfo(id){
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/admin/ground/' + id, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function (){
    if(this.readyState === XMLHttpRequest.DONE && this.status === 200){
      let res = JSON.parse(this.response);
      console.log('res : ', res);
    }
  };
  xhr.send();
}

// 경기장 등록
$('#registerMatch').on('click', function(btn){
  let row = btn.currentTarget.parentElement.parentElement;
  let html = fnGenerateRow(row);
  if(!html) return false;
  else{
    let match_list = document.querySelector('#match_list');
    // match_list.innerHTML = '';
    match_list.appendChild(html);
  }
  console.log('html : ', html);
});
function fnGenerateRow(item) {
  let match_time = item.querySelector('#matchTime');
  let match_type = item.querySelector('input[name="match_type"]');
  let ladder = item.querySelector('ladder');
  let match_grade = item.querySelector('input[name="match_grade"]');
  let sex = item.querySelector('input[name="sex"]');
  let personnel = item.querySelector('input[name="personnel"]');
  let match_price = item.querySelector('input[name="match_price"]');

  // 유효성 검증
  if (match_time.value === '') {
    alert('시간을 입력해 주세요');
    match_time.focus();
    return false;
  }
  if (match_type.value === '') {
    alert('경기 타입을 선택해 주세요');
    match_type.focus();
    return false;
  }
  if(match_grade.value === ''){
    alert('실력을 선택해 주세요');
    match_grade.focus();
    return false;
  }
  if(sex.value === ''){
    alert('성별을 선택해 주세요');
    sex.focus();
    return false;
  }
  if(personnel.value === ''){
    alert('인원수를 입력해 주세요');
    personnel.focus();
    return false;
  }
  if(match_price.value === ''){
    alert('금액을 입력해 주세요');
    match_price.focus();
    return false;
  }
  let li = document.createElement('li');
  li.className = 'list-group-item';
  let row = document.createElement('div');
  row.className = 'row';
  // 첫번째 컬럼
  let col_1 = document.createElement('div');
  col_1.className = 'col';
  // 두번째 컬럼
  let col_2 = document.createElement('div');
  col_2.className = 'col-1';
  let formGroup = document.createElement('div');
  let input = document.createElement('input');
  input.className = 'form-control py-1';
  input.setAttribute('type', 'text');
  input.setAttribute('name', 'match_time');
  formGroup.appendChild(input);
  col_2.appendChild(formGroup);
  // 세번째 컬럼
  let col_3 = document.createElement('div');
  col_3.className = 'col-3';
  ['2', '3'].forEach(function(v){
    formGroup = document.createElement('div');
    formGroup.className = 'form-check-radio form-check-inline';
    let label = document.createElement('label');
    label.className = 'form-check-label';
    input = document.createElement('input');
    input.className = 'form-check-input';
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'match_type');
    input.value = v;
    let span = document.createElement('span');
    span.className = 'form-check-sign';
    span.innerText = (v === '2' ? '2파전' : '3파전');
    label.appendChild(input);
    label.appendChild(span);
    formGroup.appendChild(label);
    col_3.appendChild(formGroup);
  });
  formGroup = document.createElement('div');
  formGroup.className = 'form-check form-check-inline';
  let label = document.createElement('label');
  label.className = 'form-check-label';
  input = document.createElement('input');
  input.className = 'form-check-input';
  input.setAttribute('type','checkbox');
  input.setAttribute('name', 'ladder');
  let span = document.createElement('span');
  span.className = 'form-check-sign';
  span.innerText = '승점제 경기';
  label.appendChild(input);
  label.appendChild(span);
  formGroup.appendChild(label);
  col_3.appendChild(formGroup);
  // 네번째 컬럼
  let col_4 = document.createElement('div');
  col_4.className = 'col-2';
  [{lbl:'상', val:'1'}, {lbl:'중',val:2},{lbl:'하', val:3}].forEach(function(v){
    formGroup = document.createElement('div');
    formGroup.className = 'form-check-radio form-check-inline';
    label = document.createElement('label');
    label.className = 'form-check-label';
    input = document.createElement('input');
    input.className = 'form-check-input';
    input.setAttribute('type', 'radio');
  });


  row.appendChild(col_1);
  row.appendChild(col_2);
  row.appendChild(col_3);
  li.appendChild(row);
  return li;
}