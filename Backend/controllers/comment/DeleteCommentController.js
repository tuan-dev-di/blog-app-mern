const { response } = require("express");
const Comment = require("../../models/Comment");

const delete_comment = async (req, res) => {
  //? ---------------| CHECK ID & ROLE |---------------
  const user_id = req.user.userId;
  const user_role = req.user.role;
  const comment_id = req.params.commentId;

  try {
    const foundComment = await Comment.findById(comment_id);
    if (!foundComment)
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });

    if (user_id !== foundComment.userId.toString() && user_role !== "admin")
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment",
      });

    const deleteComment = await Comment.findByIdAndDelete(comment_id);
    if (!deleteComment)
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully!",
    });
  } catch (error) {
    console.log("Delete comment error:", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { delete_comment };
