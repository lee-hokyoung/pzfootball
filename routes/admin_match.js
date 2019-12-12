const express = require('express');
const router = express.Router();
const Match = require('../model/match');

router.get('/list', async(req, res) => {
  let user = req.session.passport.user;
  let list = await Match.aggregate([
    {$match:{}}
  ]);
  res.render('admin_match',{
    active:'match',
    user:user,
    list:list
  });
});

module.exports = router;