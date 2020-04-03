const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MannerSchema = new Schema({
  title: String,
  point: Number
});
module.exports = mongoose.model("Manner", MannerSchema);
