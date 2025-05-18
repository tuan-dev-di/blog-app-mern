const User = require("../../models/User");

const get_users = async (req, res) => {
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

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(limit);

    const userWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUser = await User.countDocuments();
    const now = new Date();
    const monthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const userLastMonth = await User.countDocuments({
      createAt: {
        $gte: monthAgo,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Get list of user successfully!",
      userLastMonth,
      totalPage: Math.ceil(totalUser / limit),
      totalUser,
      users: userWithoutPassword,
    });
  } catch (error) {
    console.log("Get list of user error:", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { get_users };
