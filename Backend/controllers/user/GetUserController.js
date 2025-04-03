const User = require("../../models/User");

const get_user = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

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
    console.log("Get User - ERROR:", error.message);
    return res.status(400).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { get_user };
