var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  deviceId: { type: String },
  player_id: { type: String },
  result: { type: Object },
  pincode: { type: String },
  req_date: { type: String },
  alert_id: { type: Number },
  age_group: { type: Number },
  updatedTime: {
    type: Date,
    default: Date.now,
  },
  success_id: { type: String },
  display_msg: { type: String },
  isViewed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", NotificationSchema);
