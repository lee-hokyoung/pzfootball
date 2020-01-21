const User = require("../model/user");

// admin 관련 미들웨어
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};
exports.isAdmin = async (req, res, next) => {
  if (req.isAuthenticated()) {
    let user = req.session.passport.user;
    let user_info = await User.findOne({ user_id: user });
    // console.log('user info : ', user_info);
    if (user_info.admin) {
      req.session.admin = true;
      next();
    } else {
      req.logout();
      req.session.destroy();
      res.send(
        '<script>alert("관리자 권한이 없는 아이디입니다."); location.href = "/admin/login";</script>;'
      );
    }
  } else {
    res.redirect("/admin/login");
  }
};

// 사용자 관련 미들웨어
exports.isSingIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/users/login");
  }
};
exports.isNotSignIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/users/login");
  }
};
