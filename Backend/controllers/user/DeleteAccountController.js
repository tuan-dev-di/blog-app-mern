const User = require("../../models/User");

const delete_account = async (req, res) => {
  //? ---------------| CHECK ID & ROLE |---------------
  if (req.user.userId !== req.params.userId)
    return res.status(403).json({
      success: false,
      message: "Invalid role",
    });

  try {
    const deleteUser = await User.findByIdAndDelete(req.params.userId);

    //? ---------------| CHECK IF THE USER IS NOT FOUND |---------------
    if (!deleteUser)
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });

    return res.status(200).json({
      success: true,
      message: `Delete account successfully!`,
    });
  } catch (error) {
    console.log("Delete account error:", error.message);
    return res.status(400).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { delete_account };
