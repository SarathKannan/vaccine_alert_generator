import mongoose, { Schema } from "mongoose";

var AlertSchema = new Schema(
  {
    deviceId: { type: String },
    alerts: { type: Array },
    player_id: { type: String },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("Alert", AlertSchema);

export const schema = model.schema;
export default model;
