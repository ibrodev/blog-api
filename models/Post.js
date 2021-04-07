const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Post", PostSchema);
