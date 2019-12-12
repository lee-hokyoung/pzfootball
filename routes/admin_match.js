const express = require('express');
const router = express.Router();

router.get('/list', async(req, res) => {
  let user = req.session.passport.user;
  res.render('admin_match',{
    active:'match',
    user:user
  });
});

module.exports = router;