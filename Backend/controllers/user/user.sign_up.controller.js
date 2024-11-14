const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../../models/user.model");

const sign_up = async (req, res) => {
  const { username, email, password } = req.body;

  //* Regex Pattern for Username
  const usernameRegexPattern = /^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/;
  const usernameValid = usernameRegexPattern.test(username);

  //* Regex Pattern for Email
  // const emailRegexPattern = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,7}$/;
  // const emailValid = emailRegexPattern.test(email);

  //* Regex Pattern for Password
  const passwordRegexPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]*$/;
  const passwordValid = passwordRegexPattern.test(password);

  //* Check Username is a empty string
  if (!username || username === "")
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });

  //* Check Email is a empty string
  // if (!email || email === "")
  //   return res.status(400).json({
  //     success: false,
  //     message: "Email is required",
  //   });

  //* Check Password is a empty string
  if (!password || password === "")
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });

  //* Check length of Username
  if (username.length < 7 || username.length > 25)
    return res.status(400).json({
      success: false,
      message: "Username must be between 7 and 25 characters",
    });

  //* Check length of Password
  if (password.length < 7)
    return res.status(400).json({
      success: false,
      message: "Password must be greater than 6 characters",
    });

  //* Check Username is match with Regex Pattern
  if (!usernameValid)
    return res.status(400).json({
      success: false,
      message: `Username: '${username}' is not match with Regex Pattern`,
    });

  //* Check Email is match with Regex Pattern
  // if (!emailValid)
  //   return res.status(400).json({
  //     success: false,
  //     message: `Email: '${email}' is not match with Regex Pattern`,
  //   });

  //* Check Password is match with Regex Pattern
  if (!passwordValid)
    return res.status(400).json({
      success: false,
      message: `Password: '${password}' is not match with Regex Pattern`,
    });

  //* Check user existed
  const usernameExisted = await User.findOne({ username });
  if (usernameExisted)
    return res.status(400).json({
      success: false,
      message: `${username} has been already existed}`,
    });

  //* Check email existed
  // const emailExisted = await User.findOne({ email });
  // if (emailExisted)
  //   return res.status(400).json({
  //     success: false,
  //     message: `${email} has been already existed`,
  //   });

  //TODO: Encrypted Password and create a new User
  const hashedPassword = await argon2.hash(password);
  const newUser = new User({
    username: username,
    // email: email,
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
      // message: `Sign-up Successfully: Username - ${username}   |   Email - ${email}`,
      message: `Sign-up Successfully: Username - ${username}`,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
    console.log(error);
  }
};

module.exports = { sign_up };
