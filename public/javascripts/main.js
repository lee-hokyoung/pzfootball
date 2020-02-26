let curr_search = {};
if (location.search !== "") {
  location.search
    .replace("?", "")
    .split("&")
    .forEach(function(v) {
      curr_search[v.split("=")[0]] = v.split("=")[1];
    });
}
let curr_list = [];
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
    console.log("current slide : ", currentSlide);
    // list swipe 발생시 이벤트
    let obj = document.querySelector(
      ".ground-list-slider .slick-active section"
    );
    let date = new Date(obj.dataset.date);
    let xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "/schedule/" + date.toISOString().slice(0, 10) + location.search
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        curr_list = res;
        console.log("res : ", curr_list);
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
    let today = new Date();
    let table = document.querySelector("table.table-condensed");
    table.setAttribute("data-after", today.toISOString().slice(0, 7));

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
  if (res.length > 0) {
    res.forEach(function(game, idx) {
      let remain = game.personnel - (game.apply_member.length || 0);
      let status = "available";
      if (remain >= 1 && remain < 4) {
        status = "hurry";
      } else if (remain < 2) {
        status = "full";
      }
      html +=
        '<li class="list-group-item list-group-item-light py-1 px-0 mx-auto ' +
        (idx % 2 === 0 ? "bg-light" : "") +
        '" style="border:none !important">' +
        '<div class="row w-100 m-0">' +
        '<div class="col-4 col-md-2 d-block">' +
        '<small class="font-weight-bold text-secondary">TIME</small>' +
        '<h5 class="text-orange">' +
        game.match_time +
        "</h5>" +
        "</div>" +
        '<div class="col-8 col-md-7 text-left">' +
        '<small class="text-secondary font-weight-bold">' +
        game.ground_info.groundName +
        "</small>" +
        '<div class="d-flex justify-content-start">' +
        '<div class="match-wrap text-center pt-1">' +
        '<img src="/images/match_' +
        game.match_type +
        '.png">' +
        "<b>" +
        game.match_type +
        "파</b>" +
        "</div>" +
        '<div class="text-left text-dark">' +
        '<small class="pl-2 tagList ' +
        (game.sex === 1
          ? "male text-primary"
          : game.sex === -1
          ? "female text-danger"
          : "mix") +
        '">' +
        (game.sex === 1
          ? "남성매치"
          : game.sex === -1
          ? "여성매치"
          : "혼성매치") +
        "</small>" +
        "</div>" +
        '<div class="grade_icon ml-2" data-grade="' +
        game.match_grade +
        '">실력</div>';
      if (game.ladder === 1) html += '<div class="ladder_icon ml-2">승점</div>';
      html +=
        "</div>" +
        "</div>" +
        '<div class="col col-md-3 p-0" style="width:160px;" data-cnt="' +
        remain +
        '" data-id="' +
        game._id +
        '">' +
        '<button class="btn btn-status text-white p-0" data-status="' +
        status +
        '" tabindex="0">' +
        '<h5 class="m-0 py-1">' +
        (status === "hurry"
          ? "마감임박"
          : status === "available"
          ? "신청가능"
          : "마  감") +
        "</h5>" +
        '<div class="' +
        (status === "hurry"
          ? "text-warning"
          : status === "available"
          ? "text-primary"
          : "") +
        ' bg-white mx-auto font-weight-bold" style="border-radius:1rem; width:100px; font-size:13px;">' +
        remain +
        (remain > 0 ? "자리 남음" : "") +
        "</div>" +
        '<small class="position-relative" style="top:-3px;">' +
        new Intl.NumberFormat().format(game.match_price) +
        "원</small>" +
        "</button>" +
        "</div>" +
        "</div>" +
        "</li>";
    });
  } else {
    html +=
      '<li class="list-group-item list-group-item-light py-1 px-0 mx-auto">' +
      '<div class="row w-100 m-0">' +
      '<div class="col-12 text-center">' +
      "<p>아직 등록된 일정이 없습니다.  </p>" +
      "</div></div></li>";
  }
  document.querySelector(
    'div[data-slick-index="' + currentSlide + '"] ul'
  ).innerHTML = html;
}
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
// 매치 버튼 클릭 이벤트
$(document).on(
  "click",
  'button[data-status="available"], button[data-status="hurry"]',
  function() {
    let match_id = $(this)[0].parentNode.dataset.id;
    location.href = "/match/" + match_id;
  }
);
// 경기 타입, 경기장 선택시 필터링
$(".game-icons-wrap button.mr-3").on("click", function() {
  let game_type = $(this).data("game");
  curr_search["game_type"] = game_type;
  history.pushState(null, "game filter", fnGenQueryString());
  fnFilterList();
});
$("#dropdownGroundList li").on("click", function() {
  let ground_id = $(this).data("id");
  curr_search["ground_id"] = ground_id;
  history.pushState(null, "game filter", fnGenQueryString());
  fnFilterList();
});
function fnGenQueryString() {
  let queryString = [];
  for (let key in curr_search) {
    queryString.push(key + "=" + curr_search[key]);
  }
  return "?" + queryString.join("&");
}
function fnFilterList() {
  let date = $("button.btn-primary.active").data("date");
  let currentSlide = $(".btn-primary.active")
    .parent()
    .parent()
    .parent()
    .data("slick-index");
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/schedule/" + date.slice(0, 10) + location.search);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      curr_list = res;
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
}
