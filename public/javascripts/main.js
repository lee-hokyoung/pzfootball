$(function() {
  //  메인 슬라이더
  $(".main-slider").slick({
    dots: true,
    arrows: false,
    fade: true
  });
  //  날짜 선택하는 부분
  $(".calendar-slider").slick({
    slidesToShow: 7,
    slidesToScroll: 7,
    arrows: true,
    infinite: false
  });
  //  경기 리스트 슬라이더
  $(".ground-list-slider")
    .slick({
      arrows: false,
      draggable: false
    })
    .on("afterChange", function(event, slick, currentSlide) {
      // list swipe 발생시 이벤트
      let obj = document.querySelector(
        ".ground-list-slider .slick-active section"
      );
      let date = new Date(obj.dataset.date);
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "/schedule/" + date.toISOString().slice(0, 10));
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          let res = JSON.parse(this.response);
          fnGenerateGroundList(res, currentSlide);
        } else if (this.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
          let ul = document.querySelector(
            'div[data-slick-index="' + currentSlide + '"] ul'
          );
          let div = document.createElement("div");
          div.classList.add("mx-auto");
          div.classList.add("bg-dark");
          let img = document.createElement("img");
          img.src = "/nm/slick-slider/slick/ajax-loader.gif";
          img.width = 32;
          div.appendChild(img);
          ul.appendChild(div);
        }
      };
      xhr.send();
    });
  //  datetime picker
  $("#datepicker")
    .datepicker({
      startDate: new Date()
    })
    .on("show", function(e) {
      let table = document.querySelector("table.table-condensed");
      table.setAttribute("data-after", "2019.11");

      let _days = document.querySelector(".datepicker-days");
      _days.removeEventListener("click", fnChangeCalendar, false);
      _days.addEventListener("click", fnChangeCalendar, false);
    });
  //  달력 이동 함수
  function fnChangeCalendar(e) {
    let dateAfter = document.querySelector(".table-condensed");
    let now = new Date(dateAfter.getAttribute("data-after").replace(".", "-"));
    if (e.target.className === "datepicker-days") {
      if (e.offsetX < 215) {
        now.setMonth(now.getMonth() - 1);
        let month =
          now.getMonth() + 1 < 10
            ? "0" + (now.getMonth() + 1)
            : now.getMonth() + 1;
        dateAfter.setAttribute("data-after", now.getFullYear() + "-" + month);
        $("#datepicker").datepicker("setDate", new Date(now));
      } else if (e.offsetX > 267) {
        now.setMonth(now.getMonth() + 1);
        let month =
          now.getMonth() + 1 < 10
            ? "0" + (now.getMonth() + 1)
            : now.getMonth() + 1;
        dateAfter.setAttribute("data-after", now.getFullYear() + "-" + month);
        $("#datepicker").datepicker("setDate", new Date(now));
      }
    }
  }
  $('img[alt="전체달력"]').on("click", function() {
    $("#datepicker").datepicker("show");
  });
  function fnGenerateGroundList(res, currentSlide) {
    let html = "";
    res.forEach(function(game, idx) {
      html +=
        '<li class="list-group-item list-group-item-light py-1 px-0 mx-auto ' +
        (idx % 2 === 0 ? "bg-light" : "") +
        '" style="border:none !important">' +
        '<div class="row w-100">' +
        '<div class="col-4 col-md-2 d-block">' +
        '<small class="font-weight-bold text-secondary">TIME</small>' +
        '<h5 class="text-orange">' +
        game.match_time +
        "</h5>" +
        "</div>" +
        '<div class="col-8 col-md-7 text-left">' +
        '<small class="text-secondary font-weight-bold">' +
        game.label_title +
        "</small>" +
        '<div class="d-flex justify-content-start">' +
        '<div class="match-wrap text-center pt-1">' +
        '<img src="/images/match_3.png">' +
        "<b>3파</b>" +
        "</div>" +
        '<div class="text-left text-dark">' +
        '<small class="pl-2 tagList male text-primary">' +
        game.label_sex +
        "</small>" +
        "</div>" +
        '<div class="grade_icon ml-2" data-grade="' +
        game.match_grade +
        '">실력</div>' +
        '<div class="ladder_icon ml-2">승점</div>' +
        "</div>" +
        "</div>" +
        '<div class="col col-md-3">' +
        '<button class="btn btn-status text-white p-0" data-status="' +
        game.apply_status +
        '" tabindex="0">' +
        '<h5 class="m-0 py-1">' +
        (game.apply_status === "hurry"
          ? "마감임박"
          : game.apply_status === "available"
          ? "신청가능"
          : "마  감") +
        "</h5>" +
        '<div class="text-warning bg-white mx-auto font-weight-bold" style="border-radius:1rem; width:100px; font-size:13px;">1자리 남음</div>' +
        '<small class="position-relative" style="top:-3px;">' +
        game.label_cash +
        "</small>" +
        "</button>" +
        "</div>" +
        "</div>" +
        "</li>";
    });
    document.querySelector(
      'div[data-slick-index="' + currentSlide + '"] ul'
    ).innerHTML = html;
  }
});
//  날짜 선택 이벤트
function fnSelectDate(btn) {
  //  css 적용
  document.querySelectorAll(".btn-date").forEach(function(v) {
    if (v.classList.contains("btn-primary")) {
      v.classList.remove("btn-primary");
      // v.classList.add('btn-light');
      v.classList.remove("active");
    }
  });
  btn.classList.remove("btn-light");
  btn.classList.add("btn-primary");
  btn.classList.add("active");
  // list swipe
  let slick = btn.parentNode.parentNode.parentNode;
  let slick_idx = slick.dataset.slickIndex;
  $(".ground-list-slider").slick("slickGoTo", slick_idx);
}
