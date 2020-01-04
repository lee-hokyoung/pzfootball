const express = require('express');
const router = express.Router();
const Match = require('../model/match');
const Ground = require('../model/ground');

router.get('/list', async (req, res) => {
  let user = req.session.passport.user;
  let list = await Match.aggregate([
    {$match: {}}
  ]);
  res.render('admin_match', {
    active: 'match',
    title:'일정관리',
    user: user,
    list: list
  });
});
router.get('/register', async (req, res) => {
  let user = req.session.passport.user;
  let ground = await Ground.find({});
  res.render('admin_match_register', {
    active:'match',
    user:user,
    title:'일정등록',
    ground:ground
  });
});

module.exports = router;