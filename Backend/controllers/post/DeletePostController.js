const Post = require("../../models/Post");

const delete_post = async (req, res) => {
  //? ---------------| CHECK ID & ROLE |---------------
  const user_id = req.user.userId;
  const param_user_id = req.params.userId;
  const user_role = req.user.role;

  if (user_role !== "admin" || user_id !== param_user_id)
    return res.status(403).json({
      success: false,
      message: "Chức vụ không hợp lệ",
    });

  //? ---------------| DELETE A POST |---------------
  try {
    const deletePost = await Post.findByIdAndDelete(req.params.postId);

    //? ---------------| CHECK IF THE POST IS NOT FOUND |---------------
    if (!deletePost)
      return res.status(404).json({
        success: false,
        message: "Bài viết này không tồn tại",
      });

    return res.status(200).json({
      success: true,
      message: "Xóa bài viết thành công!",
    });
  } catch (error) {
    console.log("Delete post error:", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { delete_post };
