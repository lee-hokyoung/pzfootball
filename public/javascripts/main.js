$(document).ready(function () {
  // 메인 슬라이더
  $('.main-slider').slick({
    dots:true,
    arrows:false
  });
  // 날짜 선택하는 부분
  $('.calendar-slider').slick({
    slidesToShow:7,
    slidesToScroll:7,
    arrows:true,
    infinite:false,
  });
  // 날짜 선택 이벤트
  // document.querySelectorAll('.btn-date').forEach(function(v){
  //   v.addEventListener('click', function(){
  //     console.log(this);
  //     this.classList.remove('btn-light');
  //     this.classList.remove('active');
  //     this.classList.add('btn-primary');
  //     this.classList.add('active')
  //   });
  // })
  $('.btn-data').on('click', function(){
    $(this).toggleClass('active');
  })
});