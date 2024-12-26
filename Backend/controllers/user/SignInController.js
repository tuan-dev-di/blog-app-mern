const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const {
  checkEmptyUsername,
  checkEmptyPassword,
} = require("../../utilities/ValidationUser");

const sign_in = async (req, res) => {
  const { username, password } = req.body;

  if (checkEmptyUsername(username) || checkEmptyPassword(password))
    return res.status(400).json({
      success: false,
      message: "Username and Password are required",
    });

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({
        success: false,
        message: `Username: '${username}' does not existed`,
      });

    const passwordIncorrect = await argon2.verify(user.password, password);
    if (!passwordIncorrect)
      return res.status(400).json({
        success: false,
        message: "Password is incorrect",
      });

    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.Access_Token
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
      })
      .json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          profileImage: user.profileImage,
          created: user.createdAt,
          updated: user.updatedAt,
        },
        accessToken: accessToken,
      });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(400).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { sign_in };
