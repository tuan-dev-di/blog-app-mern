const Comment = require("../../models/Comment");

const get_comments = async (req, res) => {
  //? ---------------| CHECK POST ID |---------------
  const post_id = req.params.postId;
  if (!post_id)
    return res.status(404).json({
      success: false,
      message: "Post is not found",
    });

  try {
    const comments = await Comment.find({ postId: post_id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Get list of comments successfully!",
      comments,
    });
  } catch (error) {
    console.log("Get list of comments error:", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { get_comments };
