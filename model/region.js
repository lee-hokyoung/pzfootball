const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RegionSchema = new Schema({
  name: String
});
module.exports = mongoose.model("Region", RegionSchema);
