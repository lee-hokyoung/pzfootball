//  로그인 유무
let isLoggedIn = document.querySelector("#isLoggedIn").dataset.islogin === "true";
//  경기장 필터링, XMLHttpRequest
const fnMatchFilter = function () {
  let selectedBtns = document.querySelectorAll('button[name][data-toggle="true"]');
  let query = {};
  //  구장 상세 설정 필터링
  selectedBtns.forEach((v) => {
    if (v.dataset.value !== "") {
      query[v.name] = v.dataset.value;
      // query.push(obj);
    }
  });
  //  날짜 및 XHR 변수 추가
  query["match_date"] = document.querySelector("button[data-date].active").dataset.date;
  query["XHR"] = true;
  //  즐겨찾는 구장 설정 여부
  let favorite_ground = document.querySelector("button.btn-favorite");
  if (favorite_ground.dataset.toggle === "true") {
    query["ground"] = favorite_ground.dataset.id;
  }

  //  필터링 POST
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/filter", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let currentSlide = $(".btn-primary.active").parent().parent().parent().data("slick-index");
      let res = JSON.parse(this.response);
      fnGenerateGroundList(res.list, currentSlide);
    }
  };
  xhr.send(JSON.stringify(query));
};
//  필터링
let filter_labels = ["gender", "skill", "match_type", "match_vs", "region"];
filter_labels.forEach(function (lb) {
  document.querySelectorAll('button[name="' + lb + '"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (lb === "region") {
        document.querySelector("button.btn-favorite").dataset.toggle = "false";
      }
      document.querySelectorAll('button[name="' + lb + '"]').forEach(function (b) {
        b.dataset.toggle = "false";
      });
      this.dataset.toggle = "true";
      fnMatchFilter();
    });
  });
});
//  즐겨찾는 구장 버튼 클릭 이벤트
let btnFavorite = document.querySelector("button.btn-favorite");
if (btnFavorite) {
  btnFavorite.addEventListener("click", function () {
    let toggle = this.dataset.toggle;
    let regionBtns = document.querySelectorAll('button[name="region"]');
    this.dataset.toggle = toggle === "false";
    if (this.dataset.toggle === "true") {
      regionBtns.forEach(function (btn) {
        btn.dataset.toggle = "false";
      });
      document.querySelector('button[name="region"][data-value=""]').dataset.toggle = "true";
      fnMatchFilter();
    } else {
      document.querySelector('button[name="region"][data-value=""]').click();
    }
  });
}
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
//  날짜 선택하는 부분
$(".calendar-slider").slick({
  slidesToShow: 7,
  slidesToScroll: 7,
  arrows: true,
  infinite: false,
});
//  경기 리스트 슬라이더
$(".ground-list-slider")
  .slick({
    arrows: false,
    draggable: false,
  })
  .on("afterChange", function (event, slick, currentSlide) {
    fnMatchFilter();
  });

//  날짜 선택 이벤트
function fnSelectDate(btn) {
  //  css 적용
  document.querySelectorAll(".btn-date").forEach(function (v) {
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
//  nav sticky  메인 페이지 하단 go to top 버튼 관련
let offset = $(".navigation").offset();
let navParent = $(".navigation");
let nav = navParent.find("nav");
let tmp = navParent.find("nav").clone().attr("class", "tmp").css("visibility", "hidden");
let scrollTopButton = document.querySelector("#scrollTop");
window.addEventListener("scroll", function () {
  if (window.pageYOffset > offset.top) {
    navParent.append(tmp);
    nav.css({ position: "fixed", top: 0 });
    scrollTopButton.dataset.view = "true";
  } else {
    navParent.find(".tmp").remove();
    nav.css({ position: "static", top: "" });
    scrollTopButton.dataset.view = "false";
  }
});
//  탑 버튼
document.querySelector("#scrollTop").addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
//  경기장 선택시 이동
document.querySelectorAll("li[data-id]").forEach(function (li) {
  li.addEventListener("click", function () {
    location.href = "/match/" + this.dataset.id;
  });
});

//  경기 리스트 생성
function fnGenerateGroundList(res, currentSlide) {
  document.querySelector(".match-count").innerHTML = "총 " + res.length + "매치";
  let ul = document.querySelector('div[data-slick-index="' + currentSlide + '"] ul');
  ul.innerHTML = "";
  document.querySelector(".filter-wrap span").innerText = "총 " + res.length + "매치";
  if (res.length > 0) {
    res.forEach(function (game, idx) {
      let remain = game.personnel.max - (game.apply_member.length || 0);
      let percent = game.apply_member.length / game.personnel.max;
      let status = "available",
        statusText = "";
      if (percent <= 0.6) {
        status = "available";
        statusText = "신청가능";
      } else if (percent < 1 && percent > 0.6) {
        status = "hurry";
        statusText = "마감임박";
      } else {
        status = "full";
        statusText = "마  감";
      }
      let li = document.createElement("li");
      li.classList = "list-group-item";
      li.dataset.id = game._id;
      li.addEventListener("click", function () {
        location.href = "/match/" + game._id;
      });

      let row = document.createElement("div");
      row.className = "row";
      let col = document.createElement("div");
      col.className = "col-md-10 col-8 my-auto";

      //  시간, 경기장 부분
      let inner_row = document.createElement("div");
      inner_row.className = "row";
      let inner_col = document.createElement("div");
      inner_col.className = "col-md-6";
      let time_group_wrap = document.createElement("div");
      time_group_wrap.className = "time-ground-wrap d-flex justify-content-start";
      let p = document.createElement("p");
      p.className = "pl-5";
      p.innerText = game.match_time;
      time_group_wrap.appendChild(p);
      p = document.createElement("p");
      p.className = favorite_ground.indexOf(game.ground_info._id) > -1 ? "position-relative pl-5 star" : "pl-5";
      p.innerText = game.ground_info.groundName;
      time_group_wrap.appendChild(p);
      inner_col.appendChild(time_group_wrap);
      inner_row.appendChild(inner_col);

      //  경기 상세 설명 부분(2,3파 매치, 성별, 실력)
      inner_col = document.createElement("div");
      inner_col.className = "col-md-4";
      let flex = document.createElement("div");
      flex.className = "d-flex justify-content-start";
      //    match-wrap
      let inner_div = document.createElement("div");
      inner_div.className = "match-wrap text-center pt-1";
      let b = document.createElement("b");
      b.innerText = game.match_type + "파";
      inner_div.appendChild(b);
      b = document.createElement("b");
      b.className = "pl-2";
      b.innerText = game.match_vs + " vs " + game.match_vs;
      inner_div.appendChild(b);
      flex.appendChild(inner_div);
      //    text-left.text-dark
      inner_div = document.createElement("div");
      inner_div.className = "text-left text-dark";
      let small = document.createElement("small");
      small.className = "pl-2 tagList";
      //  + (game.sex === "1" ? " male text-primary" : game.sex === "2" ? " female text-danger" : " mix");
      small.innerText = game.sex === "1" ? "남성" : game.sex === "2" ? "여성" : "혼성";
      inner_div.appendChild(small);
      flex.appendChild(inner_div);
      //    grade_icon.ml-2
      inner_div = document.createElement("div");
      if (game.ladder !== 1) {
        inner_div.className = "grade_icon ml-2";
        inner_div.dataset.grade = game.match_grade;
        inner_div.dataset.title = "실력";
        inner_div.innerText = game.match_grade === "1" ? "고급" : game.match_grade === "2" ? "중급" : "초급";
        flex.appendChild(inner_div);
      } else {
        inner_div.className = "ladder_icon ml-2";
        inner_div.dataset.title = "승점";
        let b = document.createElement("b");
        b.innerText = "(+" + game.match_score + ")";
        flex.appendChild(inner_div);
        flex.appendChild(b);
      }
      inner_col.appendChild(flex);
      inner_row.appendChild(inner_col);
      col.appendChild(inner_row);
      row.appendChild(col);

      inner_col = document.createElement("div");
      inner_col.className = "col-md-2 text-right";
      b = document.createElement("b");
      b.innerText = game.apply_member.length + " / " + game.personnel.max;
      inner_col.appendChild(b);
      inner_row.appendChild(inner_col);
      col.appendChild(inner_row);
      row.appendChild(col);

      //  col-md-2.col-4
      col = document.createElement("div");
      col.className = "col-md-2 col-4";
      let skew = document.createElement("div");
      skew.className = "skew-wrap";
      inner_div = document.createElement("div");
      inner_div.className = "apply-btn-wrap";
      inner_div.dataset.status = status;
      inner_div.innerText = statusText;
      skew.appendChild(inner_div);
      col.appendChild(skew);

      row.appendChild(col);
      li.appendChild(row);
      ul.appendChild(li);
    });
  } else {
    let li = document.createElement("li");
    li.className = "list-group-item list-group-item-light py-1 px-0 mx-auto";
    let row = document.createElement("div");
    row.className = "row w-100 m-0";
    let col = document.createElement("div");
    col.className = "col-12 text-center";
    let p = document.createElement("p");
    p.innerText = "아직 등록된 일정이 없습니다.";
    col.appendChild(p);
    row.appendChild(col);
    li.appendChild(row);
    ul.appendChild(li);
  }
}
