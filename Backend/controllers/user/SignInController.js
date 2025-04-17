const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const {
  checkEmptyUsername,
  checkEmptyPassword,
} = require("../../utilities/ValidationUser");

const sign_in = async (req, res) => {
  const { username, password } = req.body;

  //? ---------------| CHECK EMPTY USERNAME & PASSWORD |---------------
  if (checkEmptyUsername(username) || checkEmptyPassword(password))
    return res.status(400).json({
      success: false,
      message: "Username and Password are required",
    });

  try {
    const userValid = await User.findOne({ username });
    if (!userValid)
      return res.status(400).json({
        success: false,
        message: "Incorrect username or password",
      });

    const passwordCorrect = await argon2.verify(userValid.password, password);
    if (!passwordCorrect)
      return res.status(400).json({
        success: false,
        message: "Incorrect username or password",
      });

    const accessToken = jwt.sign(
      {
        userId: userValid._id,
        role: userValid.role,
      },
      process.env.Access_Token,
      {
        expiresIn: "24h",
      }
    );

    const { password: userPassword, ...user } = userValid._doc;

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
        message: "Sign in successfully!",
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
