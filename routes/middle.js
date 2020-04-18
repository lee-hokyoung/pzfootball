const User = require("../model/user");
const Manager = require("../model/manager");
const mongoose = require("mongoose");

//  admin 관련 미들웨어
exports.isLoggedIn = (req, res, next) => {
  console.log("manager is logged in");
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};
exports.isNotLoggedIn = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    // Manager 로그인 확인
    if (req.session) {
      let user_info = await User.findOne({
        user_id: req.session.passport.user.user_id,
      });
      if (user_info.isManager) {
        req.logout();
        req.session.destroy();
        res.send(
          '<script>alert("매니저 권한으로 로그인 했습니다. 자동 로그아웃 되었습니다.")</script>'
        );
      }
    }
    res.redirect("/admin/login");
  }
};
exports.isAdmin = async (req, res, next) => {
  if (req.isAuthenticated()) {
    let user = req.session.passport.user;
    let user_info = await User.findOne({ user_id: user.user_id });
    if (!user_info) {
      req.logout();
      req.session.destroy();
      return res.send(
        '<script>alert("관리자 권한이 없는 아이디입니다."); location.href = "/admin/login";</script>;'
      );
    }
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
    let user_info = req.session.passport.user;
    if (user_info.isManager) {
      let script = `<script>alert("매니저 권한으로 로그인 했습니다. 일반 유저로 로그인해주세요"); location.href='/';</script>`;
      req.logout();
      req.session.destroy();
      res.send(script);
    } else {
      next();
    }
  } else {
    res.redirect("/users/login");
  }
};
exports.isNotSignedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/users/login");
  }
};

//  매니저 관련 미들웨어
exports.isManager = async (req, res, next) => {
  if (req.isAuthenticated()) {
    let user = req.session.passport.user;
    let isManager = await Manager.findOne({
      _id: mongoose.Types.ObjectId(user._id),
    });
    if (isManager) {
      req.session.manager = true;
      next();
    } else {
      req.logout();
      req.session.destroy();
      res.send(
        '<script>alert("매니저 권한이 없는 아이디입니다."); location.href = "/auth/manager";</script>;'
      );
    }
  } else {
    res.redirect("/auth/manager");
  }
};
exports.isLoggedInByManager = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/manager");
  }
};
exports.isNotLoggedInByManger = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/manager");
  }
};
