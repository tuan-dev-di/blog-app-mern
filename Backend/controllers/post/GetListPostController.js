const Post = require("../../models/Post");

const list_post = async (req, res) => {
  try {
    const postStartIndex = parseInt(req.query.postStartIndex) || 0;
    const limitPost = parseInt(req.query.limitPost) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Create query
    let query = {};
    if (req.query.userId) query.userId = req.query.userId;
    if (req.query.category) query.category = req.query.category;
    if (req.query.slug) query.slug = req.query.slug;
    if (req.query.postId) query._id = req.query.postId;
    if (req.query.searchTerm) {
      query.$or = [
        { title: { $regex: req.query.searchTerm, $option: "i" } },
        { content: { $regex: req.query.searchTerm, $option: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .sort({ updateAt: sortDirection })
      .skip(postStartIndex)
      .limit(limitPost);
    const totalPost = await Post.countDocuments();

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
      totalPost,
      postLastMonth,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(400).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { list_post };
