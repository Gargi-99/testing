// backend/models/list.js
const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    user: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Tag",
        required: false, // Make tags optional
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("List", listSchema);
