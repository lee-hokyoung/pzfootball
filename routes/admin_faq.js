const express = require("express");
const router = express.Router();
const Faq = require("../model/fag");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  let list = await Faq.find({});
  res.render("admin_faq", {
    list: list,
    title: "퍼즐풋볼 - 자주 묻는 질문",
    active: "faq"
  });
});
router.get("/register", (req, res) => {
  res.render("admin_faq_register", {
    title: "퍼즐풋볼 - 자주 묻는 질문",
    active: "faq"
  });
});
router.post("/register", async (req, res) => {
  try {
    let data = req.body;
    data.keyword = req.body.keyword.split(",");
    let result = await Faq.create(data);
    if (result.ok === 1) {
      res.json({ code: 1, message: "등록 성공", result: result });
    } else {
      res.json({ code: 0, message: "등록 실패", result: result });
    }
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
module.exports = router;
