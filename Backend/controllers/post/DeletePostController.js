const Post = require("../../models/Post");

const delete_post = async (req, res) => {
  //? ---------------| CHECK ID & ROLE |---------------
  if (req.user.role !== "admin" || req.user.userId !== req.params.userId)
    return res.status(403).json({
      success: false,
      message: "Invalid role",
    });

  //? ---------------| DELETE A POST |---------------
  try {
    const deletePost = await Post.findByIdAndDelete(req.params.postId);

    //? ---------------| CHECK IF THE POST IS NOT FOUND |---------------
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
    console.log("Delete Post - ERROR:", error.message);
    return res.status(400).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { delete_post };
