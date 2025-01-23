const Post = require("../../models/Post");
const {
  checkEmptyTitle,
  checkLengthTitle,
  checkRegexTitle,
  checkEmptyCategory,
  checkEmptyContent,
  checkLengthContent,
  checkRegexContent,
  // checkEmptyImage,
} = require("../../utilities/ValidationPost");

const create_post = async (req, res) => {
  //? ==================== Get Id and role of user ====================
  const user_id = req.user.userId;
  const user_role = req.user.role;
  if (user_role !== "admin")
    return res.status(403).json({
      success: false,
      message: "Invalid role",
    });

  const { title, category, content, imagePost } = req.body;

  //? ==================== CHECK TITLE ====================
  //* Title is an empty string
  if (checkEmptyTitle(title))
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });

  //* Length of title
  if (checkLengthTitle(title))
    return res.status(400).json({
      success: false,
      message: "Length of title must between 10 and 50 characters",
    });

  //* Title is matched with Regex Pattern
  if (!checkRegexTitle(title))
    return res.status(400).json({
      success: false,
      message: "Title is not matched with Regex Pattern",
    });

  const titleExisted = await Post.findOne({ title });
  if (titleExisted)
    return res.status(200).json({
      success: false,
      message: "This title is already existed, please try again!",
    });

  //? ==================== CHECK CATEGORY ====================
  //* Category is an empty string
  if (checkEmptyCategory(category))
    return res.status(400).json({
      success: false,
      message: "Category is required",
    });

  //? ==================== CHECK CONTENT ====================
  //* Content is an empty string
  if (checkEmptyContent(content))
    return res.status(400).json({
      success: false,
      message: "Content is required",
    });

  if (checkLengthContent(content))
    return res.status(400).json({
      success: false,
      message: "Length of content must between 50 and 5000 characters",
    });

  if (!checkRegexContent(content))
    return res.status(400).json({
      success: false,
      message: "Content is not match with Regex Pattern",
    });

  //? ==================== CHECK SLUG ====================
  const slug = title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^A-Za-z0-9-]/g, "-");

  //? ==================== CHECK IMAGE ====================

  //? ==================== CREATE A NEW POST ====================
  const newPost = new Post({
    userId: user_id,
    title: title,
    category: category,
    content: content,
    slug: slug,
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
