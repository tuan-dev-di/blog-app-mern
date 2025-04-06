const Comment = require("../../models/Comment");

const like_comment = async (req, res) => {
  const user_id = req.user.userId;
  if (!user_id)
    return res.status(403).json({
      success: false,
      message: "User not found",
    });

  const comment_id = req.params.commentId;

  try {
    const comment = await Comment.findById(comment_id);

    if (!comment)
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });

    const userIndex = comment.likes.indexOf(user_id);

    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(user_id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();

    return res.status(200).json({
      success: true,
      message: "Comment saved successfully",
      comment,
    });
  } catch (error) {}
};

module.exports = { like_comment };
