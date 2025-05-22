const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
const User = require("../../models/User");

const get_comments = async (req, res) => {
  const user_id = req.user.userId;
  const user_role = req.user.role;

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const skip = (page - 1) * limit;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    let comments;
    let totalComment;
    let extraComments;

    if (user_role === "admin") {
      comments = await Comment.find()
        .sort({ createdAt: sortDirection })
        .skip(skip)
        .limit(limit);

      totalComment = await Comment.countDocuments();
    } else {
      comments = await Comment.find({ userId: user_id })
        .sort({ createdAt: sortDirection })
        .skip(skip)
        .limit(limit);

      totalComment = await Comment.countDocuments({ userId: user_id });
    }

    extraComments = await Promise.all(
      comments.map(async (comment) => {
        try {
          const user = await User.findOne({ _id: comment.userId });
          const post = await Post.findOne({ _id: comment.postId });

          return {
            userInformation: {
              displayName: user?.displayName || "Unknown Display Name",
              email: user?.email || "Unknown Email",
              username: user?.username || "Unknown Username",
            },
            postInformation: {
              title: post?.title || "Unknown Title Post",
            },
          };
        } catch (error) {
          console.log("ERROR:", error);
          return {
            userInformation: {
              displayName: "ERROR",
              email: "ERROR",
              username: "ERROR",
            },
            postInformation: {
              title: "ERROR",
            },
          };
        }
      })
    );

    return res.status(200).json({
      success: true,
      message: "Get list of comments successfully!",
      totalPage: Math.ceil(totalComment / limit),
      totalComment,
      comments,
      extraComments,
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
