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
} = require("../../utilities/ValidationUser");

const sign_up = async (req, res) => {
  const { username, password, email, displayName } = req.body;

  //? ---------------| CHECK USERNAME |---------------
  if (checkEmptyUsername(username))
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });

  if (checkLengthUsername(username))
    return res.status(400).json({
      success: false,
      message: "Username must be between 7 and 25 characters",
    });

  if (!checkRegexUsername(username))
    return res.status(400).json({
      success: false,
      message: `Username: '${username}' is not matched with Regex Pattern`,
    });

  const usernameExisted = await User.findOne({ username });
  if (usernameExisted)
    return res.status(400).json({
      success: false,
      message: `Username: '${username}' has been used`,
    });

  //? ---------------| CHECK PASSWORD |---------------
  if (checkEmptyPassword(password))
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });

  if (checkLengthPassword(password))
    return res.status(400).json({
      success: false,
      message: "Password must be longer than 6 characters",
    });

  if (!checkRegexPassword(password))
    return res.status(400).json({
      success: false,
      message:
        "Password must have at least 1 special character, 1 number character, 1 capital letter",
    });

  const hashedPassword = await argon2.hash(password);

  //? ---------------| CHECK EMAIL |---------------
  if (checkEmptyEmail(email))
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });

  if (!checkRegexEmail(email))
    return res.status(400).json({
      success: false,
      message: `Email: '${email}' is not matched with Regex Pattern`,
    });

  const emailExisted = await User.findOne({ email });
  if (emailExisted)
    return res.status(400).json({
      success: false,
      message: `Email: '${email}' has been used`,
    });

  //? ---------------| CHECK DISPLAY NAME |---------------
  if (checkEmptyDisplayName(displayName))
    return res.status(400).json({
      success: false,
      message: "Display Name is required",
    });

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
        message: `Sign up successfully: '${username}' - '${email}'`,
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
