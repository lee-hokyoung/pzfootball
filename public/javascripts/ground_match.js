$(".detail-slider").on("init", function () {
  $(".full-cover-pzfutball").css("display", "none");
});
$(".detail-slider").slick({
  dots: true,
  arrows: false,
  fade: true,
});
//  매치 버튼 클릭 이벤트
document.querySelectorAll("button[data-status]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    location.href = "/match/" + this.parentNode.dataset.id;
  });
});
//  탭 클릭 이벤트
document.querySelectorAll('a[data-toggle="tab"]').forEach(function (a) {
  a.addEventListener("click", function () {
    let tab = document.querySelector(a.getAttribute("href"));
    console.log(tab);
    document.querySelectorAll('.tab-content div[role="tabpanel"]').forEach(function (panel) {
      panel.className = "tab-pane fade";
    });
    tab.className = "tab-pane fade show active";
  });
});
//  경기장 선택시 이동
document.querySelectorAll("li[data-id]").forEach(function (li) {
  li.addEventListener("click", function () {
    location.href = "/match/" + this.dataset.id;
  });
});
