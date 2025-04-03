const Comment = require("../../models/Comment");

const create_comment = async (req, res) => {
  //? ---------------| CHECK ID & ROLE |---------------
  const user_id = req.user.userId;

  //? ---------------| GET POST ID |---------------
  const post_id = req.params.postId;

  //? ---------------| GET COMMENT CONTENT |---------------
  const { content } = req.body;
  try {
    if (user_id !== req.params.userId)
      return res.status(403).json({
        success: false,
        message: "You are not allowed to create a comment",
      });

    if (!post_id)
      return res.status(403).json({
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
    return res.status(400).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { create_comment };
