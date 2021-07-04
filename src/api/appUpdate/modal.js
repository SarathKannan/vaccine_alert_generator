var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UpdateSchema = new Schema({
  version: { type: String },
  version_ios : {type: String},
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model("Update", UpdateSchema);
