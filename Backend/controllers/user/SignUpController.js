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
const { responseHelper } = require("../../utilities/ValidationUser");

const sign_up = async (req, res) => {
  const { username, password, email, displayName } = req.body;

  //? Check Username
  //* Username is an empty string
  if (checkEmptyUsername(username))
    return responseHelper(res, 400, false, "Username is required");

  //* Length of Username
  if (checkLengthUsername(username))
    return responseHelper(
      res,
      400,
      false,
      "Username must be between 7 and 25 characters"
    );

  //* Username is matched with Regex Pattern
  if (!checkRegexUsername(username))
    return responseHelper(
      res,
      400,
      false,
      `Username: '${username}' is not matched with Regex Pattern`
    );

  //* Existed Username
  const usernameExisted = await User.findOne({ username });
  if (usernameExisted)
    return responseHelper(
      res,
      400,
      false,
      `Username: '${username}' has been already existed`
    );

  //? Check Password
  //* Password is an empty string
  if (checkEmptyPassword(password))
    return responseHelper(res, 400, false, "Password is required");

  //* Length of Password
  if (checkLengthPassword(password))
    return responseHelper(
      res,
      400,
      false,
      "Password must be greater than 6 characters"
    );

  //* Password is matched with Regex Pattern
  if (!checkRegexPassword(password))
    return responseHelper(
      res,
      400,
      false,
      "Your password is not matched with Regex Pattern"
    );

  //? Encrypted Password
  const hashedPassword = await argon2.hash(password);

  //? Check Email
  //* Email is an empty string
  if (checkEmptyEmail(email))
    return responseHelper(res, 400, false, "Email is required");

  //* Email is matched with Regex Pattern
  if (!checkRegexEmail(email))
    return responseHelper(
      res,
      400,
      false,
      `Email: '${email}' is not matched with Regex Pattern`
    );

  //* Existed Email
  const emailExisted = await User.findOne({ email });
  if (emailExisted)
    return responseHelper(
      res,
      400,
      false,
      `Email: '${email}' has been already existed`
    );

  //? Check Display Name
  //* Display Name is an empty string
  if (checkEmptyDisplayName(displayName))
    return responseHelper(res, 400, false, "Display Name is required");

  //* Length of Display Name
  if (checkLengthDisplayName(displayName))
    return responseHelper(
      res,
      400,
      false,
      `Your name: '${displayName}' must be between 2 and 50 characters`
    );

  //* Display Name is match with Regex Pattern
  if (!checkRegexDisplayName(displayName))
    return responseHelper(
      res,
      400,
      false,
      `Your name: '${displayName}' is not matched with Regex Pattern`
    );

  //? Create a new User
  const newUser = new User({
    username: username,
    password: hashedPassword,
    email: email,
    displayName: displayName,
  });

  //* Passed validation
  try {
    await newUser.save();

    // Return token
    const accessToken = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.Access_Token
    );

    const { password: userPassword, ...user } = newUser._doc;

    return responseHelper(
      res,
      200,
      true,
      `User: ${username} sign up successfully`,
      [
        {
          name: "accessToken",
          value: accessToken,
          options: {
            httpOnly: true,
            secure: true,
            expiresIn: "24h",
          },
        },
      ],
      { user, accessToken: accessToken }
    );
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

module.exports = { sign_up };
