const User = require("../model/user");
const Manager = require("../model/manager");
const mongoose = require("mongoose");

//  admin 관련 미들웨어
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
    let user_info = await User.findOne({ user_id: user.user_id });
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

//  사용자 관련 미들웨어
exports.isSignedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};
exports.isNotSignIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};

//  매니저 관련 미들웨어
exports.isManager = async (req, res, next) => {
  if (req.isAuthenticated()) {
    let user = req.session.passport.user;
    let isManager = await Manager.findOne({
      user_id: mongoose.Types.ObjectId(user.user_id)
    });
    if (isManager) {
      req.session.manager = true;
      next();
    } else {
      req.logout();
      req.session.destroy();
      res.send(
        '<script>alert("매니저 권한이 없는 아이디입니다."); location.href = "/";</script>;'
      );
    }
  } else {
    res.redirect("/");
  }
};
