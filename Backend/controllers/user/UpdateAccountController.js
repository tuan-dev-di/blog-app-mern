const argon2 = require("argon2");
const User = require("../../models/User");

const {
  checkLengthPassword,
  checkRegexPassword,
  checkRegexEmail,
  checkLengthDisplayName,
  checkRegexDisplayName,
} = require("../../utilities/ValidationUser.js");

const update_account = async (req, res) => {
  const user_id = req.user.userId;
  const param_user_id = req.params.userId;
  if (user_id !== param_user_id)
    return res.status(403).json({
      success: false,
      message: "Invalid role",
    });

  const { username, password, email, displayName, profileImage } = req.body;

  //? ---------------| CHECK PASSWORD |---------------
  if (password) {
    if (checkLengthPassword(password))
      return res.status(400).json({
        success: false,
        message: "Password must be longer than 6 characters",
      });

    if (!checkRegexPassword(password))
      return res.status(400).json({
        success: false,
        message: "Your password is not matched with Regex Pattern",
      });
  }

  //? ---------------| CHECK EMAIL |---------------
  const emailExisted = await User.findOne({ email });
  if (emailExisted)
    return res.status(400).json({
      success: false,
      message: `Email: '${email}' has been used`,
    });

  if (email)
    if (!checkRegexEmail(email))
      return res.status(400).json({
        success: false,
        message: `Email: '${email}' is not matched with Regex Pattern`,
      });

  //? ---------------| CHECK DISPLAY NAME |---------------
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

  //? ---------------| CHECK IF ANY FIELDS HAS BEEN CHANGED FROM USER, ONLY DATA ON THAT FIELD WILL BE UPDATED |---------------
  const updateData = {};
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

    //? ---------------| CHECK IF THE USER IS NOT FOUND |---------------
    if (!updateUser)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    const { password, ...user } = updateUser._doc;

    return res.status(200).json({
      success: true,
      message: "Update account successfully!",
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
