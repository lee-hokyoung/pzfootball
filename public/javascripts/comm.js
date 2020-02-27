Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

// sidebar 관련
$(document).ready(function() {
  $("#sidebar").mCustomScrollbar({
    theme: "minimal"
  });

  $("#dismiss, .overlay").on("click", function() {
    // hide sidebar
    $("#sidebar").removeClass("active");
    // hide overlay
    $(".overlay").removeClass("active");
  });

  $("#sidebarCollapse").on("click", function() {
    // open sidebar
    $("#sidebar").addClass("active");
    // fade in the overlay
    $(".overlay").addClass("active");
    $(".collapse.in").toggleClass("in");
    $("a[aria-expanded=true]").attr("aria-expanded", "false");
  });
});
