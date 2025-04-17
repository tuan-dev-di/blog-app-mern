const User = require("../../models/User");

const get_user = async (req, res) => {
  const param_user_id = req.params.userId;

  try {
    const user = await User.findById(param_user_id);

    if (!user)
      return res.status(400).json({
        success: false,
        message: "User not found",
      });

    const { password, ...rest } = user._doc;

    return res.status(200).json({
      success: true,
      message: "Get user successfully!",
      rest,
    });
  } catch (error) {
    console.log("Get user error:", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { get_user };
