import mongoose, { Schema } from "mongoose";

var WebWatchSchema = new Schema(
  {
    deviceId: { type: String },
    player_id: { type: String },
    result: { type: Array },
    pincode: { type: String },
    req_date: { type: String },
    alert_id: { type: Number },
    age_group: { type: Number },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("WebWatch", WebWatchSchema);

export const schema = model.schema;
export default model;
