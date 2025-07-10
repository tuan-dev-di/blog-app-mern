const Post = require("../../models/Post");
const {
  checkEmptyTitle,
  checkLengthTitle,
  checkRegexTitle,
  checkEmptyContent,
  checkLengthContent,
  // checkRegexContent,
} = require("../../utilities/validPost");

const create_post = async (req, res) => {
  //? ---------------| CHECK ID & ROLE |---------------
  const user_id = req.user.userId;
  const param_user_id = req.params.userId;
  const user_role = req.user.role;

  if (user_role !== "admin" || user_id !== param_user_id)
    return res.status(403).json({
      success: false,
      message: "Chức vụ không hợp lệ",
    });

  const { title, category, content, image } = req.body;

  //? ---------------| CHECK TITLE |---------------
  if (checkEmptyTitle(title))
    return res.status(400).json({
      success: false,
      message: "Tiêu đề không được để trống",
    });

  if (checkLengthTitle(title))
    return res.status(400).json({
      success: false,
      message: "Độ dài tiêu đề phải đạt từ 10 đến 50 ký tự",
    });

  if (!checkRegexTitle(title))
    return res.status(400).json({
      success: false,
      message: "Tiêu đề không hợp lệ",
    });

  const titleExisted = await Post.findOne({ title });
  if (titleExisted)
    return res.status(400).json({
      success: false,
      message: "Tiêu đề này đã được dùng, xin thử lại!",
    });

  //? ---------------| CHECK CONTENT |---------------
  if (checkEmptyContent(content))
    return res.status(400).json({
      success: false,
      message: "Nội dung không được để trống",
    });

  if (checkLengthContent(content))
    return res.status(400).json({
      success: false,
      message: "Độ dài tiêu đề phải đạt từ 50 đến 5000 ký tự",
    });

  //? ---------------| CREATE SLUG FROM TITLE |---------------
  const slug = title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^A-Za-z0-9-]/g, "-");

  //? ---------------| CREATE A NEW POST |---------------
  const newPost = new Post({
    userId: user_id,
    title: title,
    category: category,
    content: content,
    slug: slug,
    image: image,
  });

  try {
    await newPost.save();
    const { ...post } = newPost._doc;

    return res.status(200).json({
      success: true,
      message: "Tạo mới bài viết thành công!",
      post: post,
    });
  } catch (error) {
    console.log("Create post error:", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { create_post };
