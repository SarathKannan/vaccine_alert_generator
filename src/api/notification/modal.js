import mongoose, { Schema } from "mongoose";


var NotificationSchema = new Schema({
  deviceId: { type: String },
  player_id: { type: String },
  result: { type: Object },
  pincode: { type: String },
  req_date: { type: String },
  alert_id: { type: Number },
  age_group: { type: Number },
  success_id: { type: String },
  display_msg: { type: String },
  isViewed: { type: Boolean, default: false },
},{
  timestamps: true,
});

const model = mongoose.model("Notification", NotificationSchema);

export const schema = model.schema;
export default model;
