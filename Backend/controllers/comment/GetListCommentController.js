const Comment = require("../../models/Comment");

const get_comments = async (req, res) => {
  const param_user_id = req.params.userId;
  const user_id = req.user.userId;
  const user_role = req.user.role;

  if (user_role !== "admin" || user_id !== param_user_id)
    return res.status(403).json({
      success: false,
      message: "Invalid role",
    });

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const skip = (page - 1) * limit;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const comments = await Comment.find()
      .populate("postId", "title")
      .populate("userId", "username")
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(limit);

    const totalComment = await Comment.countDocuments();

    return res.status(200).json({
      success: true,
      message: "Get list of comments successfully!",
      totalPage: Math.ceil(totalComment / limit),
      totalComment,
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
