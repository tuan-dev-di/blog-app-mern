const argon2 = require("argon2");
const {
  checkLengthPassword,
  checkRegexPassword,
  checkRegexEmail,
  checkLengthDisplayName,
  checkRegexDisplayName,
} = require("../../utilities/validationUser");
const User = require("../../models/User");

const update_profile = async (req, res) => {
  if (req.user.userId !== req.params.userId) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to update this profile",
    });
  }

  const updateData = {};
  const { username, password, email, displayName, profileImage } = req.body;

  //? Check password if user want to update password in their profile page
  if (password) {
    if (checkLengthPassword(password))
      return res.status(400).json({
        success: false,
        message: "Password must be greater than 6 characters",
      });

    if (!checkRegexPassword(password))
      return res.status(400).json({
        success: false,
        message: "Your password is not matched with Regex Pattern",
      });
  }

  //? Check email if user want to update email in their profile page
  if (email)
    if (!checkRegexEmail(email))
      return res.status(400).json({
        success: false,
        message: `Email: '${email}' is not matched with Regex Pattern`,
      });

  //?: Check display name if user want to update display name in their profile page
  if (displayName) {
    if (checkLengthDisplayName(displayName))
      return res.status(400).json({
        success: false,
        message: `Your name: '${displayName}' must be between 2 and 50 characters`,
      });

    if (!checkRegexDisplayName(displayName))
      return res.status(400).json({
        success: false,
        message: `Your name: '${displayName}' is not matched with Regex Pattern`,
      });
  }

  //? Check if any fields has been changed from user, only data on that field will be updated
  if (username) updateData.username = username;
  if (password) updateData.password = await argon2.hash(password);
  if (email) updateData.email = email;
  if (displayName) updateData.displayName = displayName;
  if (profileImage) updateData.profileImage = profileImage;

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateData },
      { new: true }
    );

    //* Check if the user is not updated
    if (!updateUser)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    //* Check user is updated and do not response password
    const { password, ...rest } = updateUser._doc;

    return res.status(200).json({
      success: true,
      user: rest,
    });
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(400).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { update_profile };
