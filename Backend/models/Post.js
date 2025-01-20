const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      min: 10,
      max: 50,
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://cdn.vectorstock.com/i/1000v/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
