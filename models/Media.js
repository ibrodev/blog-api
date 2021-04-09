const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MediaSchema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: String, required: true },
    path: { type: String, required: true },
    url: { type: String, required: true },
    mimetype: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", MediaSchema);
