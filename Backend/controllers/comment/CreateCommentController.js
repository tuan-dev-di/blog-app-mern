const Comment = require("../../models/Comment");

const create_comment = async (req, res) => {
  const user_id = req.user.userId;
  const param_user_id = req.params.userId;

  const post_id = req.params.postId;

  const { content } = req.body;
  try {
    if (user_id !== param_user_id)
      return res.status(403).json({
        success: false,
        message: "You are not allowed to create a comment",
      });

    if (!post_id)
      return res.status(404).json({
        success: false,
        message: "Post is not found",
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
      message: "Create comment successfully!",
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
