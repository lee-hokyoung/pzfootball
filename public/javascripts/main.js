$(document).ready(function () {
  // 메인 슬라이더
  $('.main-slider').slick({
    dots:true,
    arrows:false,
    fade:true
  });
  // 날짜 선택하는 부분
  $('.calendar-slider').slick({
    slidesToShow:7,
    slidesToScroll:7,
    arrows:true,
    infinite:false,
  });
  $('.ground-list-slider').slick({
    arrows:false
  }).on('afterChange', function(event, slick, currentSlide){
    // list swipe 발생시 이벤트
    console.log(event, slick, currentSlide);
    let obj = document.querySelector('.ground-list-slider .slick-active section');
    let date = new Date(obj.dataset.date);
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/schedule/' + m + '/' + d);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200){
        let res = JSON.parse(this.response);
        console.log('res : ', res);
      }
    };
    xhr.send();
  });

});
// 날짜 선택 이벤트
function fnSelectDate(btn){
  // css 적용
  document.querySelectorAll('.btn-date').forEach(function(v){
    if(v.classList.contains('btn-primary')) {
      v.classList.remove('btn-primary');
      // v.classList.add('btn-light');
      v.classList.remove('active');
    }
  });
  btn.classList.remove('btn-light');
  btn.classList.add('btn-primary');
  btn.classList.add('active');
  // list swipe
  let slick = btn.parentNode.parentNode.parentNode;
  let slick_idx = slick.dataset.slickIndex;
  $('.ground-list-slider').slick('slickGoTo', slick_idx);
}