const express = require("express");
const router = express.Router();
const User = require("../model/user");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});
router.post("/login", async (req, res) => {
  let user_id = req.body.user_id;
  try {
    let exUser = await User.findOne({ user_id: user_id });
    console.log("exuser : ", exUser);
    if (exUser) {
      if(exUser.user_pw ===)
      res.json({ code: 1, message: "로그인 성공" });
    } else {
      res.json({ code: 0, message: "회원정보가 없습니다" });
    }
  } catch (err) {
    console.error(err);
    res.json({ code: 0, message: "로그인 실패" });
  }
});

module.exports = router;
