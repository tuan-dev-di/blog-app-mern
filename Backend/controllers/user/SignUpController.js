const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

const sign_up = async (req, res, next) => {
  const { email, username, password } = req.body;

  //* Regex Pattern for Email
  const emailRegexPattern = /^[a-zA-Z0-9](?!.*[.\-_]{2})([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const emailValid = emailRegexPattern.test(email);

  //* Regex Pattern for Username
  const usernameRegexPattern = /^[A-Za-z](?!.*[.\-_]{2})(?!.*[.\-_].*[.\-_])[A-Za-z0-9]*(?:[.\-_][A-Za-z0-9]+)*$/;
  const usernameValid = usernameRegexPattern.test(username);

  //* Regex Pattern for Password
  const passwordRegexPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*[!@#$%^&*]{2})(?!.*[!@#$%^&*][^A-Za-z0-9]).*$/;
  const passwordValid = passwordRegexPattern.test(password);

  //TODO: Check Email
  //* Email is a empty string
  if (!email || email === "")
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });

  //* Email is match with Regex Pattern
  if (!emailValid)
    return res.status(400).json({
      success: false,
      message: `${email} is not matched with Regex Pattern`,
    });

  //* Existed Email
  const emailExisted = await User.findOne({ email });
  if (emailExisted)
    return res.status(400).json({
      success: false,
      message: `${email} has been already existed`,
    });

  //TODO: Check Username
  //* Username is a empty string
  if (!username || username === "")
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });

  //* Length of Username
  if (username.length < 7 || username.length > 25)
    return res.status(400).json({
      success: false,
      message: "Username must be between 7 and 25 characters",
    });

  //* Username is match with Regex Pattern
  if (!usernameValid)
    return res.status(400).json({
      success: false,
      message: `Username: '${username}' is not matched with Regex Pattern`,
    });

  //* Existed Username
  const usernameExisted = await User.findOne({ username });
  if (usernameExisted)
    return res.status(400).json({
      success: false,
      message: `${username} has been already existed`,
    });

  //TODO: Check Password
  //* Password is a empty string
  if (!password || password === "")
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });

  //* Length of Password
  if (password.length < 7)
    return res.status(400).json({
      success: false,
      message: "Password must be greater than 6 characters",
    });

  //* Password is match with Regex Pattern
  if (!passwordValid)
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
      message: `Sign-up Successfully | Username: ${username} | Email: ${email}`,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error || "Internal Error Server",
    });
  }
};

module.exports = { sign_up };

//* Maybe code like this
// if (!parameter || parameter === "")
//   return res.status(statusCode).json({
//     success: false,
//     message: "Parameter is required",
//   });
