const express = require('express');
const router = express.Router();
const Ground = require('../model/ground');

router.get('/', async(req, res) => {
  let user = req.session.passport.user;
  let list = await Ground.aggregate([
    {$match:{}}
  ]);
  res.render('admin_ground',{
    active:'ground',
    user:user,
    list:list,
    title:'경기장 관리'
  });
});
router.get('/register', async(req, res) => {
  res.render('admin_ground_register', {
    active:'ground',
    title:'경기장 등록'
  });
});

module.exports = router;