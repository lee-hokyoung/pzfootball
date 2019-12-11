const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  user_id:{type:String, required:true, unique:true},
  user_pw:String,
  user_name:{type:String},
  admin:{type:Boolean, default:false},
  user_phone:String,
  created_at:{type:Date, default:Date.now}
});
module.exports = mongoose.model('User', UserSchema);