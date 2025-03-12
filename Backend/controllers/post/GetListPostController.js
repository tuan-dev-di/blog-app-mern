const Post = require("../../models/Post");

const get_posts = async (req, res) => {
  const user_id = req.user.userId;
  const user_role = req.user.role;

  if (user_role !== "admin" || user_id !== req.params.userId)
    return res.status(403).json({
      success: false,
      message: "Invalid role",
    });

  try {
    //? ---------------| CREATE VARIABLE TO CHECK PAGE |---------------
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const skip = (page - 1) * limit;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Create query
    let query = {};
    if (req.query.userId) query.userId = req.query.userId;
    if (req.query.category) query.category = req.query.category;
    if (req.query.slug) query.slug = req.query.slug;
    if (req.query.postId) query._id = req.query.postId;
    if (req.query.searchTerm) {
      query.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .sort({ updateAt: sortDirection })
      .skip(skip)
      .limit(limit);
    const totalPost = await Post.countDocuments(query);

    const now = new Date();
    const monthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const postLastMonth = await Post.countDocuments({
      createAt: {
        $gte: monthAgo,
      },
    });

    return res.status(200).json({
      posts,
      totalPage: Math.ceil(totalPost / limit),
      totalPost,
      postLastMonth,
    });
  } catch (error) {
    console.log("Get Post - ERROR:", error.message);
    return res.status(400).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { get_posts };
