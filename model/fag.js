const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// FAQ 스키마
const faqSchema = new Schema({
  category: String,
  title: String,
  content: String,
  keyword: [String],
  updated: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Faq", faqSchema, "faq");
