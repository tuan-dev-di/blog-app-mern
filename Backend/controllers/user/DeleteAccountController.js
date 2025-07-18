const User = require("../../models/User");

const delete_account = async (req, res) => {
  //? ---------------| CHECK ID & ROLE |---------------
  const user_id = req.user.userId;
  const param_user_id = req.params.userId;
  if (user_id !== param_user_id)
    return res.status(403).json({
      success: false,
      message: "Chức vụ không hợp lệ",
    });

  try {
    const deleteUser = await User.findByIdAndDelete(param_user_id);

    //? ---------------| CHECK IF THE USER IS NOT FOUND |---------------
    if (!deleteUser)
      return res.status(404).json({
        success: false,
        message: "Tài khoản này không hợp lệ",
      });

    return res.status(200).json({
      success: true,
      message: `Xóa tài khoản thành công!`,
    });
  } catch (error) {
    console.log("Delete account error:", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { delete_account };
