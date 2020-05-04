//  메인 슬라이더
$(".main-slider").on("init", function (e, s) {
  $(".full-cover-pzfutball").css("display", "none");
});
$(".main-slider").slick({
  dots: true,
  arrows: false,
  fade: false,
  autoplay: true,
  autoplaySpeed: 5000,
});
//  round slick
$("#round-wrap").slick({
  dots: false,
  infinite: false,
  slidesToShow: 10,
  slidesToScroll: 10,
});
