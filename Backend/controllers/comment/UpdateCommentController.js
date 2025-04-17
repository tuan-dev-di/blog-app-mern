const Comment = require("../../models/Comment");

const update_comment = async (req, res) => {
  const user_id = req.user.userId;
  const comment_id = req.params.commentId;

  const updateData = {};
  const { content } = req.body;

  if (content) updateData.content = content;

  try {
    const foundComment = await Comment.findById(comment_id);

    if (!foundComment)
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });

    if (user_id !== foundComment.userId.toString())
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this comment",
      });

    const updateComment = await Comment.findByIdAndUpdate(
      comment_id,
      { $set: updateData },
      { new: true }
    );

    const { ...comment } = updateComment._doc;

    return res.status(200).json({
      success: true,
      message: "Comment update successfully!",
      comment: comment,
    });
  } catch (error) {
    console.log("Update comment error", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { update_comment };
