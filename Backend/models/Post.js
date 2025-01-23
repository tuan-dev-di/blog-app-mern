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
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        "https://wordtracker-swoop-uploads.s3.amazonaws.com/uploads/ckeditor/pictures/1247/content_wordtracker_blog_article_image.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
