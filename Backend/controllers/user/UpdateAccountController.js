const argon2 = require("argon2");
const User = require("../../models/User");

const {
  checkLengthPassword,
  checkRegexPassword,
  checkRegexEmail,
  checkLengthDisplayName,
  checkRegexDisplayName,
} = require("../../utilities/ValidationUser.js");
const { responseHelper } = require("../../utilities/ValidationUser");

const update_account = async (req, res) => {
  if (req.user.userId !== req.params.userId)
    return responseHelper(
      res,
      403,
      false,
      "You are not allowed to update this profile"
    );

  const updateData = {};
  const { username, password, email, displayName, profileImage } = req.body;

  //? Check password if user want to update password in their profile page
  if (password) {
    if (checkLengthPassword(password))
      return responseHelper(
        res,
        400,
        false,
        "Password must be greater than 6 characters"
      );

    if (!checkRegexPassword(password))
      return responseHelper(
        res,
        400,
        false,
        "Your password is not matched with Regex Pattern"
      );
  }

  //? Check email if user want to update email in their profile page
  if (email)
    if (!checkRegexEmail(email))
      return responseHelper(
        res,
        400,
        false,
        `Email: '${email}' is not matched with Regex Pattern`
      );

  //?: Check display name if user want to update display name in their profile page
  if (displayName) {
    if (checkLengthDisplayName(displayName))
      return responseHelper(
        res,
        400,
        false,
        `Your name: '${displayName}' must be between 2 and 50 characters`
      );

    if (!checkRegexDisplayName(displayName))
      return responseHelper(
        res,
        400,
        false,
        `Your name: '${displayName}' is not matched with Regex Pattern`
      );
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
    if (!updateUser) return responseHelper(res, 404, false, "User not found");

    //* Check user is updated and do not response password
    const { password, ...rest } = updateUser._doc;

    // return res.status(200).json({
    //   success: true,
    //   user: rest,
    // });
    return responseHelper(res, 200, true, "Update account successfully!", {
      user: rest,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return responseHelper(
      res,
      400,
      false,
      `${error.message}` || "Internal Server Error"
    );
  }
};

module.exports = { update_account };
