const argon2 = require("argon2");
const User = require("../../models/User");
const imagekit = require("../../utilities/imageKit");

const {
  checkLengthPassword,
  checkRegexPassword,
  checkRegexEmail,
  checkLengthDisplayName,
  checkRegexDisplayName,
} = require("../../utilities/validUser");

const update_account = async (req, res) => {
  //? ---------------| CHECK ID |---------------
  const user_id = req.user.userId;
  const param_user_id = req.params.userId;
  if (user_id !== param_user_id)
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền cập nhật tài khoản này",
    });

  const { username, password, email, displayName, profileImage } = req.body;

  //? ---------------| CHECK PASSWORD |---------------
  if (password) {
    if (checkLengthPassword(password))
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải nhiều hơn 7 ký tự",
      });

    if (!checkRegexPassword(password))
      return res.status(400).json({
        success: false,
        message:
          "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt, 1 ký tự số, 1 ký tự chữ hoa và thường",
      });
  }

  //? ---------------| CHECK EMAIL |---------------
  const emailExisted = await User.findOne({ email });
  if (emailExisted)
    return res.status(400).json({
      success: false,
      message: `Email: '${email}' đã được sử dụng`,
    });

  if (email)
    if (!checkRegexEmail(email))
      return res.status(400).json({
        success: false,
        message: `Email: '${email}' không phù hợp`,
      });

  //? ---------------| CHECK DISPLAY NAME |---------------
  if (displayName) {
    if (checkLengthDisplayName(displayName))
      return res.status(400).json({
        success: false,
        message: `Tên hiển thị phải có độ dài từ 2 đến 50 ký tự`,
      });

    if (!checkRegexDisplayName(displayName))
      return res.status(400).json({
        success: false,
        message: `Tên của bạn: '${displayName}' không phù hợp`,
      });
  }

  //? ---------------| CHECK IF ANY FIELDS HAS BEEN CHANGED FROM USER, ONLY DATA ON THAT FIELD WILL BE UPDATED |---------------
  const updateData = {};
  if (username) updateData.username = username;
  if (password) updateData.password = await argon2.hash(password);
  if (email) updateData.email = email;
  if (displayName) updateData.displayName = displayName;

  //? ---------------| COMPARE OLD AND NEW IMAGE |---------------
  //? ---------------| ADD NEW IMAGE AND DELETE OLD IMAGE ON IMAGEKIT |---------------
  const currentUser = await User.findById(param_user_id); // Get all info of user by Id
  const oldImage = currentUser?.profileImage; // Get current image of user
  if (profileImage) {
    // Check if user changes new image
    if (profileImage !== oldImage && oldImage) {
      try {
        // Compare old and new image
        // Get filename of old image
        // https://ik.imagekit.io/v1/folder/filename.jpg => filename: avatar.jpg
        const filename = new URL(oldImage).pathname.split("/").pop();

        // Get name of old image by param filename
        const result = await imagekit.listFiles({
          searchQuery: `name=${filename}`,
        });

        // Check result, and get imageId to use function deleteFile
        if (result.length !== 0 || result.length > 0) {
          const fileId = result[0].fileId;
          await imagekit.deleteFile(fileId);
        }
      } catch (error) {
        console.warn("ERROR:", error.message);
      }
    }
    updateData.profileImage = profileImage;
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateData },
      { new: true }
    );

    //? ---------------| CHECK IF THE USER IS NOT FOUND |---------------
    if (!updateUser)
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản này!",
      });

    const { password, ...user } = updateUser._doc;

    return res.status(200).json({
      success: true,
      message: "Cập nhật tài khoản thành công!",
      user: user,
    });
  } catch (error) {
    console.log("Update account error:", error);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { update_account };
