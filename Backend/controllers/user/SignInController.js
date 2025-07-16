const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const {
  checkEmptyUsername,
  checkEmptyPassword,
} = require("../../utilities/validUser");
const {
  generateAccessToken,
} = require("../../utilities/authToken");

const sign_in = async (req, res) => {
  const { username, password } = req.body;

  //? ---------------| CHECK EMPTY USERNAME & PASSWORD |---------------
  if (checkEmptyUsername(username) || checkEmptyPassword(password))
    return res.status(400).json({
      success: false,
      message: "Tên tài khoản và mật khâu không được để trống",
    });

  try {
    const userValid = await User.findOne({ username });
    if (!userValid)
      return res.status(400).json({
        success: false,
        message: "Tên tài khoản hoặc mật khẩu không hợp lệ",
      });

    const passwordCorrect = await argon2.verify(userValid.password, password);
    if (!passwordCorrect)
      return res.status(400).json({
        success: false,
        message: "Tên tài khoản hoặc mật khẩu không hợp lệ",
      });

    const accessToken = generateAccessToken(userValid);

    const { password: userPassword, ...user } = userValid._doc;

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        maxAge: 12 * 60 * 60 * 1000,
        // => 12 (hours) * 60 (minutes) * 60 (seconds) * 1000 (milliseconds)
      })
      .json({
        success: true,
        message: "Đăng nhập thành công!",
        user: user,
        accessToken: accessToken,
      });
  } catch (error) {
    console.log("Sign in error:", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { sign_in };
