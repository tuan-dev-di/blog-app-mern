const Comment = require("../../models/Comment");

const get_comments_in_post = async (req, res) => {
  //? ---------------| CHECK POST ID |---------------
  const post_id = req.params.postId;
  if (!post_id)
    return res.status(404).json({
      success: false,
      message: "Bài viết này không tồn tại",
    });

  try {
    //? ---------------| GET TOTAL AND DATA OF COMMENTS |---------------
    const totalComment = await Comment.countDocuments({ postId: post_id });
    const comments = await Comment.find({ postId: post_id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Danh sách các bình luận trong bài viết!",
      totalComment,
      comments,
    });
  } catch (error) {
    console.log("Get list of comments in post error:", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { get_comments_in_post };
