const express = require('express');
const router = express.Router();
const passport = require('passport');
const middle = require('../routes/middle');
const User = require('../model/user');

router.get('/', middle.isLoggedIn, async(req, res) => {
  let user = req.session.passport.user;
  res.render('admin_index', {
    user:user
  });
});
router.get('/login', middle.isNotLoggedIn, (req, res) => {
  res.render('admin_login')
});
router.get('/logout', middle.isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.render('admin_login');
});
router.post('/login', middle.isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info)=>{
    console.log('info : ', info);
    if(info){
      return res.send('<script>alert("' + info.message + '"); location.href = "/admin/login";</script>');
    }
    if(authError){
      console.error(authError);
      return next(authError);
    }
    if(!user){
      console.log('not user');
      return res.redirect('/admin/login');
    }
    return req.login(user, async (loginError) => {
      if(loginError){
        console.error(loginError);
        return next(loginError);
      }
      res.redirect('/admin');
    });
  })(req, res, next);
});

// 회원관리
router.get('/user/list', middle.isLoggedIn, async (req, res) => {
  let list = await User.find({});
  res.render('admin_user', {
    active:'user',
    list:list
  })
});
module.exports = router;