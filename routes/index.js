const express = require('express');
const router = express.Router();
const MatchModel = require('../model/match');

/* GET home page. */
router.get('/', async (req, res, next) => {
  let list = await MatchModel.find({});
  console.log('list : ', list);
  res.render('index', {
    list: list
  });
});

router.get('/schedule/:month/:date', async (req, res) => {
  let list = await MatchModel.find({});
  res.json(list);
});
module.exports = router;
