const Post = require("../../models/Post");
const {
  checkEmptyTitle,
  checkLengthTitle,
  checkEmptyCategory,
  checkEmptyContent,
  // checkEmptyImage,
} = require("../../utilities/ValidationPost");

const create_post = async (req, res) => {
  const user_id = req.user.userId;
  const user_role = req.user.role;
  if (user_role !== "admin")
    return res.status(403).json({
      success: false,
      message: "Invalid role",
    });

  const { title, category, content, imagePost } = req.body;
  if (checkEmptyTitle(title))
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });

  if (checkLengthTitle(title))
    return res.status(400).json({
      success: false,
      message: "Length of title must between 10 and 50 characters",
    });

  if (checkEmptyCategory(category))
    return res.status(400).json({
      success: false,
      message: "Category is required",
    });

  if (checkEmptyContent(content))
    return res.status(400).json({
      success: false,
      message: "Content is required",
    });

  const newPost = new Post({
    userId: user_id,
    title: title,
    category: category,
    content: content,
    imagePost: imagePost,
  });

  try {
    await newPost.save();
    const { ...post } = newPost._doc;

    return res.status(200).json({
      success: true,
      post: post,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(400).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { create_post };
