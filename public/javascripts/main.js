//  로그인 유무
let isLoggedIn =
  document.querySelector("#isLoggedIn").dataset.isLogin === "true";
let curr_search = {};
if (location.search !== "") {
  location.search
    .replace("?", "")
    .split("&")
    .forEach(function (v) {
      curr_search[v.split("=")[0]] = v.split("=")[1];
    });
}
let curr_list = [];
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
    xhr.onreadystatechange = function () {
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
//  nav sticky  메인 페이지 하단 go to top 버튼 관련
let offset = $(".navigation").offset();
let navParent = $(".navigation");
let nav = navParent.find("nav");
let tmp = navParent
  .find("nav")
  .clone()
  .attr("class", "tmp")
  .css("visibility", "hidden");
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
//  scroll top button click event
document.querySelector("#scrollTop").addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

//  경기 리스트 생성
function fnGenerateGroundList(res, currentSlide) {
  let html = "";
  document.querySelector(".match-count").innerHTML =
    "총 " + res.length + "매치";
  document.querySelector(
    'div[data-slick-index="' + currentSlide + '"] ul'
  ).innerHTML = "";
  if (res.length > 0) {
    res.forEach(function (game, idx) {
      let remain = game.personnel.max - (game.apply_member.length || 0);
      let percent = game.apply_member.length / game.personnel.max;
      let status = "available";
      if (percent <= 0.6) {
        status = "available";
      } else if (percent < 1 && percent > 0.6) {
        status = "hurry";
      } else {
        status = "full";
      }

      // if (remain >= 1 && remain < 4) {
      //   status = "hurry";
      // } else if (remain < 2) {
      //   status = "full";
      // }
      let li = document.createElement("li");
      li.classList =
        "list-group-item list-group-item-light py-1 px-0 mx-auto " +
        (idx % 2 === 0 ? "bg-light" : "");

      let row = document.createElement("div");
      row.className = "row";
      //  col-md-10.col-8.my-auto
      let col = document.createElement("div");
      col.className = "col-md-10 col-8 my-auto";
      let inner_row = document.createElement("div");
      inner_row.className = "row";
      //  col-md-6
      let inner_col = document.createElement("div");
      inner_col.className = "col-md-6";
      let time_group_wrap = document.createElement("div");
      time_group_wrap.className =
        "time-ground-wrap d-flex justify-content-start";
      let p = document.createElement("p");
      p.className = "ml-3 text-info";
      p.innerText = game.match_time;
      time_group_wrap.appendChild(p);
      p = document.createElement("p");
      p.className = "ml-3 text-dark";
      p.innerText = game.ground_info.groundName;
      time_group_wrap.appendChild(p);
      inner_col.appendChild(time_group_wrap);
      inner_row.appendChild(inner_col);
      //  col-md-5.ml-3
      inner_col = document.createElement("div");
      inner_col.className = "col-md-5 ml-3";
      let flex = document.createElement("div");
      flex.className = "d-flex justify-content-start";
      //    match-wrap
      let inner_div = document.createElement("div");
      inner_div.className = "match-wrap text-center pt-1";
      let b = document.createElement("b");
      b.innerText = game.match_type + "파";
      inner_div.appendChild(b);
      flex.appendChild(inner_div);
      //    text-left.text-dark
      inner_div = document.createElement("div");
      inner_div.className = "text-left text-dark";
      let small = document.createElement("small");
      small.className =
        "pl-2 tagList" +
        (game.sex === 1
          ? " male text-primary"
          : game.sex === -1
          ? " female text-danger"
          : " mix");
      small.innerText =
        game.sex === 1 ? "남성매치" : game.sex === -1 ? "여성매치" : "혼성매치";
      inner_div.appendChild(small);
      flex.appendChild(inner_div);
      //    grade_icon.ml-2
      inner_div = document.createElement("div");
      if (game.ladder !== 1) {
        inner_div.className = "grade_icon ml-2";
        inner_div.dataset.grade = game.match_grade;
        inner_div.dataset.title = "실력";
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

      //  col-md-2.col-4
      col = document.createElement("div");
      col.className = "col-md-2 col-4";
      let div = document.createElement("div");
      div.className = "pull-right w-100";
      div.dataset.cnt = remain;
      div.dataset.id = game._id;

      let button = document.createElement("button");
      if (status === "full") {
        button.className = "btn btn-neutral btn-status text-white";
        button.dataset.status = "full";
        small.className = "m-0";
        small.innerText = "마  감";
        button.appendChild(small);
      } else {
        button.className = "btn btn-neutral btn-status text-white p-0";
        button.dataset.status = status;
        let h5 = document.createElement("h5");
        h5.className = "m-0 py-1";
        h5.innerText = status === "hurry" ? "곧 마감!" : "신청가능!";
        inner_div = document.createElement("div");
        inner_div.className =
          "text-danger bg-white mx-auto font-weight-bold mb-1";
        inner_div.style = "border-radius:1rem; width:80%; font-size:.75rem";
        inner_div.innerText =
          game.apply_member.length + " / " + game.personnel.max;
        button.appendChild(h5);
        button.appendChild(inner_div);
      }
      button.addEventListener("click", function () {
        location.href = "/match/" + game._id;
      });
      div.appendChild(button);
      col.appendChild(div);
      row.appendChild(col);
      li.appendChild(row);

      document
        .querySelector('div[data-slick-index="' + currentSlide + '"] ul')
        .appendChild(li);

      //     html +=
      //       '<li class="list-group-item list-group-item-light py-1 px-0 mx-auto ' +
      //       (idx % 2 === 0 ? "bg-light" : "") +
      //       '" style="border:none !important">' +
      //       '<div class="row w-100 m-0">' +
      //       '<div class="col-4 col-md-2 d-block">' +
      //       '<small class="font-weight-bold text-secondary">TIME</small>' +
      //       '<h5 class="text-orange">' +
      //       game.match_time +
      //       "</h5>" +
      //       "</div>" +
      //       '<div class="col-8 col-md-7 text-left">' +
      //       '<small class="text-secondary font-weight-bold">' +
      //       game.ground_info.groundName +
      //       "</small>" +
      //       '<div class="d-flex justify-content-start">' +
      //       '<div class="match-wrap text-center pt-1">' +
      //       '<img src="/images/match_' +
      //       game.match_type +
      //       '.png">' +
      //       "<b>" +
      //       game.match_type +
      //       "파</b>" +
      //       "</div>" +
      //       '<div class="text-left text-dark">' +
      //       '<small class="pl-2 tagList ' +
      //       (game.sex === 1
      //         ? "male text-primary"
      //         : game.sex === -1
      //         ? "female text-danger"
      //         : "mix") +
      //       '">' +
      //       (game.sex === 1
      //         ? "남성매치"
      //         : game.sex === -1
      //         ? "여성매치"
      //         : "혼성매치") +
      //       "</small>" +
      //       "</div>" +
      //       '<div class="grade_icon ml-2" data-grade="' +
      //       game.match_grade +
      //       '">실력</div>';
      //     if (game.ladder === 1) html += '<div class="ladder_icon ml-2">승점</div>';
      //     html +=
      //       "</div>" +
      //       "</div>" +
      //       '<div class="col col-md-3 p-0" style="width:160px;" data-cnt="' +
      //       remain +
      //       '" data-id="' +
      //       game._id +
      //       '">' +
      //       '<button class="btn btn-status text-white p-0" data-status="' +
      //       status +
      //       '" tabindex="0">' +
      //       '<h5 class="m-0 py-1">' +
      //       (status === "hurry"
      //         ? "마감임박"
      //         : status === "available"
      //         ? "신청가능"
      //         : "마  감") +
      //       "</h5>" +
      //       '<div class="' +
      //       (status === "hurry"
      //         ? "text-warning"
      //         : status === "available"
      //         ? "text-primary"
      //         : "") +
      //       ' bg-white mx-auto font-weight-bold" style="border-radius:1rem; width:100px; font-size:13px;">' +
      //       remain +
      //       (remain > 0 ? "자리 남음" : "") +
      //       "</div>" +
      //       '<small class="position-relative" style="top:-3px;">' +
      //       new Intl.NumberFormat().format(game.match_price) +
      //       "원</small>" +
      //       "</button>" +
      //       "</div>" +
      //       "</div>" +
      //       "</li>";
    });
  } else {
    html +=
      '<li class="list-group-item list-group-item-light py-1 px-0 mx-auto">' +
      '<div class="row w-100 m-0">' +
      '<div class="col-12 text-center">' +
      "<p>아직 등록된 일정이 없습니다.  </p>" +
      "</div></div></li>";
  }
  // document.querySelector(
  //   'div[data-slick-index="' + currentSlide + '"] ul'
  // ).innerHTML = html;
}
//  datetime picker
// let today = new Date();
// $("#datepicker")
//   .datepicker({
//     startDate: new Date(),
//     endDate: today.addDays(27)
//   })
//   .on("changeDate", function(c) {
//     if (!c.date) return false;
//     let year = c.date.getFullYear();
//     let month = c.date.getMonth() + 1;
//     let day = c.date.getDate();
//     let selectedDate =
//       year +
//       "-" +
//       (month < 10 ? "0" + month : month) +
//       "-" +
//       (day < 10 ? "0" + day : day);
//     $('button[data-date="' + selectedDate + '"]').click();
//   })
//   .on("show", function(e) {
//     let today = new Date();
//     let table = document.querySelector("table.table-condensed");
//     table.setAttribute("data-after", today.toISOString().slice(0, 7));

//     let _days = document.querySelector(".datepicker-days");
//     _days.removeEventListener("click", fnChangeCalendar, false);
//     _days.addEventListener("click", fnChangeCalendar, false);
//   });
// //  달력 이동 함수
// function fnChangeCalendar(e) {
//   let today = new Date();
//   let now_month = today.getMonth();
//   let dateAfter = document.querySelector(".table-condensed");
//   let now = new Date(dateAfter.getAttribute("data-after").replace(".", "-"));
//   if (e.target.className === "datepicker-days") {
//     // 이전 달력으로 이동할 때
//     if (e.offsetX < 215) {
//       now.setMonth(now.getMonth() - 1);
//       let month =
//         now.getMonth() + 1 < 10
//           ? "0" + (now.getMonth() + 1)
//           : now.getMonth() + 1;
//       if (parseInt(month) <= parseInt(now_month)) return false;
//       dateAfter.setAttribute("data-after", now.getFullYear() + "-" + month);
//       $("#datepicker").datepicker("setDate", new Date(now));
//     }
//     // 다음 달력으로 이동할 떄
//     else if (e.offsetX > 267) {
//       now.setMonth(now.getMonth() + 1);
//       let month =
//         now.getMonth() + 1 < 10
//           ? "0" + (now.getMonth() + 1)
//           : now.getMonth() + 1;
//       if (parseInt(month) > parseInt(now_month) + 2) return false;
//       dateAfter.setAttribute("data-after", now.getFullYear() + "-" + month);
//       $("#datepicker").datepicker("setDate", new Date(now));
//     }
//   }
// }
// $('img[alt="전체달력"]').on("click", function() {
//   $("#datepicker").datepicker("show");
// });
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
// 매치 버튼 클릭 이벤트
let match_buttons = document.querySelectorAll("button[data-status]");
if (match_buttons) {
  match_buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      location.href = "/match/" + this.parentNode.dataset.id;
    });
  });
}

// $(document).on("click", "button[data-status]", function() {
//   let match_id = $(this)[0].parentNode.dataset.id;
//   location.href = "/match/" + match_id;
// });

// $(".game-icons-wrap button.mr-3").on("click", function() {
//   let game_type = $(this).data("game");
//   curr_search["game_type"] = game_type;
//   history.pushState(null, "game filter", fnGenQueryString());
//   fnFilterList();
// });
// $("#dropdownGroundList li").on("click", function() {
//   let ground_id = $(this).data("id");
//   curr_search["ground_id"] = ground_id;
//   history.pushState(null, "game filter", fnGenQueryString());
//   fnFilterList();
// });

// 경기 타입, 경기장 선택시 필터링
//  bootstrap switch
$(".bootstrap-switch").bootstrapSwitch();
$("input.bootstrap-switch").on("switchChange.bootstrapSwitch", function (
  event,
  state
) {
  let type_2 = $('input.bootstrap-switch[value="2"]').bootstrapSwitch("state");
  let type_3 = $('input.bootstrap-switch[value="3"]').bootstrapSwitch("state");
  if (!type_2 && !type_3) {
    curr_search["game_type"] = null;
  } else {
    if (type_2 && !type_3) {
      curr_search["game_type"] = 2;
    } else if (!type_2 && type_3) {
      curr_search["game_type"] = 3;
    } else {
      delete curr_search.game_type;
    }
  }
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
  xhr.onreadystatechange = function () {
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
//  지역 필터링 내 버튼 클릭시 이벤트
// document
//   .querySelectorAll("#filterModalRegion .button-group button")
//   .forEach(function (btn) {
//     btn.addEventListener("click", function () {
//       let toggle = this.dataset.toggle;
//       this.dataset.toggle = toggle === "false";
//     });
//   });
//  적용하기 버튼 클릭 이벤트
// document
//   .querySelector("#filterModalRegion .modal-footer button")
//   .addEventListener("click", function () {
//     let region_list = [];
//     document
//       .querySelectorAll(
//         '#filterModalRegion .button-group button[data-toggle="true"]'
//       )
//       .forEach(function (btn) {
//         region_list.push(btn.dataset.id);
//       });
//     // let query = "region=" + region_list.join(",");
//     curr_search["region"] = region_list.join(",");
//     history.pushState(null, "game filter", fnGenQueryString());
//     fnFilterList();
//     $("#filterModalRegion").modal("hide");
//   });
//  지역별 전체 버튼 클릭
document.querySelectorAll('button[data-role="all"]').forEach(function (btn) {
  btn.addEventListener("click", function () {
    let id = this.dataset.id;
    let parent = document.querySelector('.ground-wrap[data-id="' + id + '"]');
    let parent_toggle = this.dataset.toggle;
    this.dataset.toggle = parent_toggle === "false";
    if (this.dataset.toggle === "true") this.innerHTML = "전체선택";
    else this.innerHTML = "전체해제";
    parent.querySelectorAll("button.btn-round").forEach(function (btn) {
      btn.dataset.toggle = parent_toggle === "false";
    });
  });
});
//  구장별 버튼 클릭시 이벤트
document
  .querySelectorAll("#filterGroundModal button.btn-round")
  .forEach(function (btn) {
    btn.addEventListener("click", function () {
      let toggle = this.dataset.toggle;
      this.dataset.toggle = toggle === "false";
    });
  });
//  적용버튼 클릭 이벤트
// if (isLoggedIn)
//   document
//     .querySelector('#filterModalGround button[data-role="apply"]')
//     .addEventListener("click", function () {
//       let ground_id = [];
//       document
//         .querySelectorAll(
//           '#filterModalGround button.btn-primary[data-toggle="true"]'
//         )
//         .forEach(function (btn) {
//           ground_id.push(btn.dataset.id);
//         });

//       //  즐겨찾는 구장 등록 여부 확인
//       if (document.querySelector('input[name="chkUpdateMyGround"]').checked) {
//         console.log("update ground : ", ground_id);
//         let xhr = new XMLHttpRequest();
//         xhr.open("PUT", "/users/region", true);
//         xhr.setRequestHeader("Content-Type", "application/json");
//         xhr.onreadystatechange = function () {
//           if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
//             let res = JSON.parse(this.response);
//             if (res.code === 1) location.href = "/?" + ground_id.toString();
//           }
//         };
//         xhr.send(JSON.stringify({ ground: ground_id }));
//       } else {
//         curr_search["ground"] = ground_id.join(",");
//         history.pushState(null, "game filter", fnGenQueryString());
//         fnFilterList();
//         $("#filterModalGround").modal("hide");
//       }
//     });
//  일반/리그 매치 버튼 클릭 이벤트
document.querySelectorAll('a[data-role="match"]').forEach(function (a) {
  a.addEventListener("click", function () {
    curr_search["ladder"] = this.dataset.value;
    history.pushState(null, "game filter", fnGenQueryString());
    fnFilterList();
  });
});
//  2파/3파 버튼 클릭 이벤트
document
  .querySelector(".match_type_img")
  .addEventListener("click", function (e) {
    let match2_toggle = this.dataset.match2;
    let match3_toggle = this.dataset.match3;
    if (e.offsetX > 50) this.dataset.match3 = match3_toggle === "false";
    else this.dataset.match2 = match2_toggle === "false";
  });
//  필터 부분(성별)
let filterGender = document.querySelectorAll(
  '.btn-wrap .btn-light[name="gender"]'
);
filterGender.forEach(function (btn) {
  btn.addEventListener("click", function () {
    if (this.className.indexOf("active") > -1) this.classList.remove("active");
    else this.classList.add("active");
    // filterGender.forEach(function (item) {
    //   item.classList.remove("active");
    // });
    // this.classList.add("active");
  });
});
//  필터링(스킬, 레벨)
let filterLevel = document.querySelectorAll(
  '.btn-wrap .btn-light[name="skill"]'
);
filterLevel.forEach(function (btn) {
  btn.addEventListener("click", function () {
    if (this.className.indexOf("active") > -1) this.classList.remove("active");
    else this.classList.add("active");
    // filterLevel.forEach(function (item) {
    //   item.classList.remove("active");
    // });
    // this.classList.add("active");
  });
});
//  필터링(지역)
let filterRegion = document
  .querySelectorAll('.btn-wrap .btn-light[name="region"]')
  .forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (this.className.indexOf("active") > -1)
        this.classList.remove("active");
      else this.classList.add("active");
    });
  });
//  필터링 설정 적용하기 클릭 이벤트
function fnSetFilter() {
  let form = document.createElement("form");
  form.method = "POST";
  form.action = "/filter";
  let formData = {};
  let gender_list = [];
  let skill_list = [];
  let region_list = [];
  document
    .querySelectorAll(".btn-wrap .btn-light.active")
    .forEach(function (v) {
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

  field = document.createElement("input");
  field.type = "hidden";
  field.name = "region";
  field.value = region_list.join(",");
  form.appendChild(field);

  // let filter_data = document.querySelectorAll(".btn-wrap .btn-light.active");
  // filter_data.forEach(function (v) {
  //   if (v.name === "region") region_list.push(v.value);
  //   else {
  //     let field = document.createElement("input");
  //     field.type = "hidden";
  //     field.name = v.name;
  //     field.value = v.value;
  //     form.appendChild(field);
  //   }
  // });
  // if (region_list.length > 0) {
  //   let field = document.createElement("input");
  //   field.type = "hidden";
  //   field.name = "region";
  //   field.value = region_list.join(",");
  //   form.appendChild(field);
  // }
  document.body.appendChild(form);
  console.log(form);
  form.submit();
}
