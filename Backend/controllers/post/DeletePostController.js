const Post = require("../../models/Post");

const delete_post = async (req, res) => {
  if (req.user.role !== "admin" || req.user.userId !== req.params.userId)
    return res.status(403).json({
      success: false,
      message: "You are not allowed to delete this post",
    });

  try {
    const deletePost = await Post.findByIdAndDelete(req.params.postId);

    if (!deletePost)
      return res.status(404).json({
        success: false,
        message: "Post does not exist",
      });

    return res.status(200).json({
      success: true,
      message: "Post is deleted successfully",
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(400).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { delete_post };
