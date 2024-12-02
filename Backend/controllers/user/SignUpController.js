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
} = require("../../utilities/validationUser");

const sign_up = async (req, res, next) => {
  const { email, username, password } = req.body;

  //TODO: Check Email
  //* Email is a empty string
  if (checkEmptyEmail(email))
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });

  //* Email is match with Regex Pattern
  if (!checkRegexEmail(email))
    return res.status(400).json({
      success: false,
      message: `Email: '${email}' is not matched with Regex Pattern`,
    });

  //* Existed Email
  const emailExisted = await User.findOne({ email });
  if (emailExisted)
    return res.status(400).json({
      success: false,
      message: `Email: '${email}' has been already existed`,
    });

  //TODO: Check Username
  //* Username is a empty string
  if (checkEmptyUsername(username))
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });

  //* Length of Username
  if (checkLengthUsername(username))
    return res.status(400).json({
      success: false,
      message: "Username must be between 7 and 25 characters",
    });

  //* Username is match with Regex Pattern
  if (!checkRegexUsername(username))
    return res.status(400).json({
      success: false,
      message: `Username: '${username}' is not matched with Regex Pattern`,
    });

  //* Existed Username
  const usernameExisted = await User.findOne({ username });
  if (usernameExisted)
    return res.status(400).json({
      success: false,
      message: `Username: '${username}' has been already existed`,
    });

  //TODO: Check Password
  //* Password is a empty string
  if (checkEmptyPassword(password))
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });

  //* Length of Password
  if (checkLengthPassword(password))
    return res.status(400).json({
      success: false,
      message: "Password must be greater than 6 characters",
    });

  //* Password is match with Regex Pattern
  if (!checkRegexPassword(password))
    return res.status(400).json({
      success: false,
      message: `Password: '${password}' is not matched with Regex Pattern`,
    });

  //TODO: Encrypted Password and create a new User
  const hashedPassword = await argon2.hash(password);
  const newUser = new User({
    email: email,
    username: username,
    password: hashedPassword,
  });

  //* Passed validation
  try {
    await newUser.save();

    // Return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.Access_Token
    );

    return res.status(200).json({
      success: true,
      // message: ` | Username: ${username} | Email: ${email}`,
      message: "Sign-up Successfully",
      user: {
        id: newUser._id,
        username: `${username}`,
        email: `${email}`,
        created: newUser.createdAt,
        updated: newUser.updatedAt,
      },
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: `${error.message}` || "Internal Error Server",
    });
  }
};

module.exports = { sign_up };
