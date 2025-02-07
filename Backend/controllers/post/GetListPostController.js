const Post = require("../../models/Post");

const list_post = async (req, res) => {
  // const user_role = req.user.role;
  // console.log("User ROLE:", req.user);
  // console.log("Param ROLE:", req.params);
  // if (user_role !== "admin")
  //   return res.status(403).json({
  //     success: false,
  //     message: "Invalid role",
  //   });

  try {
    const postStartIndex = parseInt(req.query.postStartIndex) || 0;
    const limitPost = parseInt(req.query.limitPost) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          {
            title: { $regex: req.query.searchTerm, $options: "i" },
          },
          {
            content: { $regex: req.query.searchTerm, $options: "i" },
          },
        ],
      }),
    })
      .sort({
        updateAt: sortDirection,
      })
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
