const Comment = require("../../models/Comment");

const create_comment = async (req, res) => {
  //? ---------------| CHECK ID & ROLE |---------------
  const user_id = req.user.userId;
  const param_user_id = req.params.userId;
  const post_id = req.params.postId;

  const { content } = req.body;
  try {
    if (user_id !== param_user_id)
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền bình luận",
      });

    if (!post_id)
      return res.status(404).json({
        success: false,
        message: "Bài viết này không tồn tại",
      });

    const newComment = await Comment({
      userId: user_id,
      postId: post_id,
      content: content,
    });

    await newComment.save();
    const { ...comment } = newComment._doc;

    return res.status(200).json({
      success: true,
      message: "Bình luận thành công!",
      comment,
    });
  } catch (error) {
    console.log("Create comment error:", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { create_comment };
