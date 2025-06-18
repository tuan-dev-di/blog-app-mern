const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const {
  checkEmptyUsername,
  checkLengthUsername,
  checkRegexUsername,
  checkEmptyPassword,
  checkLengthPassword,
  checkRegexPassword,
  checkEmptyEmail,
  checkRegexEmail,
  checkEmptyDisplayName,
  checkLengthDisplayName,
  checkRegexDisplayName,
} = require("../../utilities/validUser");

const sign_up = async (req, res) => {
  const { username, password, email, displayName } = req.body;

  //? ---------------| CHECK USERNAME |---------------
  if (checkEmptyUsername(username))
    return res.status(400).json({
      success: false,
      message: "Tên tài khoản không được để trống",
    });

  if (checkLengthUsername(username))
    return res.status(400).json({
      success: false,
      message: "Tên tài khoản phải có độ dài từ 7 đến 25 ký tự",
    });

  if (!checkRegexUsername(username))
    return res.status(400).json({
      success: false,
      message: `Tên tài khoản: '${username}' không phù hợp`,
    });

  const usernameExisted = await User.findOne({ username });
  if (usernameExisted)
    return res.status(400).json({
      success: false,
      message: `Tên tài khoản: '${username}' đã được sử dụng`,
    });

  //? ---------------| CHECK PASSWORD |---------------
  if (checkEmptyPassword(password))
    return res.status(400).json({
      success: false,
      message: "Mật khẩu không được để trống",
    });

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

  const hashedPassword = await argon2.hash(password);

  //? ---------------| CHECK EMAIL |---------------
  if (checkEmptyEmail(email))
    return res.status(400).json({
      success: false,
      message: "Email không được để trống",
    });

  if (!checkRegexEmail(email))
    return res.status(400).json({
      success: false,
      message: `Email: '${email}' không phù hợp`,
    });

  const emailExisted = await User.findOne({ email });
  if (emailExisted)
    return res.status(400).json({
      success: false,
      message: `Email: '${email}' đã được sử dụng`,
    });

  //? ---------------| CHECK DISPLAY NAME |---------------
  if (checkEmptyDisplayName(displayName))
    return res.status(400).json({
      success: false,
      message: "Tên hiển thị không được để trống",
    });

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

  //? ---------------| CREATE NEW USER |---------------
  const newUser = new User({
    username: username,
    password: hashedPassword,
    email: email,
    displayName: displayName,
  });

  // Passed validation
  try {
    await newUser.save();

    // Return token
    const accessToken = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.Access_Token,
      {
        expiresIn: "24h",
      }
    );

    const { password: userPassword, ...user } = newUser._doc;

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        // maxAge: 24 * 60 * 60 * 1000
        // => 24 (hours) * 60 (minutes) * 60 (seconds) * 1000 (milliseconds)
      })
      .json({
        success: true,
        message: `Đăng ký thành công: '${username}' - '${email}'`,
        user: user,
        accessToken: accessToken,
      });
  } catch (error) {
    console.log("Sign up error:", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { sign_up };
