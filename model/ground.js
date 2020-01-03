const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 경기장 스키마
const groundSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  groundName: {type: String, required: true},   // 경기장명
  groundAddress: {jibun: String, road: String},   // 경기장 주소
  ground_images: {
    ground_images_1:String,
    ground_images_2:String,
    ground_images_3:String
  },                          // 경기장 이미지
  mapInfo: {Lat: Number, Lng: Number},          // 경기장 위치정보
  facility: {
    size: {x: Number, y: Number},
    shower: {type:Boolean, default:false},
    freeParking: {type:Boolean, default:false},
    shoesRental: {type:Boolean, default:false},
    uniformRental: {type:Boolean, default:false}
  },                                        // 경기장 시설
  description: String,                     // 경기장 특이사항
  updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Ground', groundSchema, 'ground');