const User = require("../../models/User");

const delete_profile = async (req, res) => {
  if (req.user.userId !== req.params.userId) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to delete this account",
    });
  }

  try {
    const deleteUser = await User.findByIdAndDelete(req.params.userId);

    if (!deleteUser)
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });

    return res.status(200).json({
      success: true,
      message: "User is deleted successfully",
    });
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(400).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { delete_profile };
