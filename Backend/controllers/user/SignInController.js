const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");


const sign_in = async (req, res) => {

  const { email, username, password } = req.body;

  if (!username || !password) return res.status(400).json({
    success: false,
    message: "Username and Password are required",
  })

  try {
    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({
      success: false,
      message: `'${username}' does not exist`,
    })

    const passwordIncorrect = await argon2.verify(user.password, password);
    if (!passwordIncorrect) return res.status(400).json({
      success: false,
      message: "Password is incorrect",
    })

    const accesToken = jwt.sign({
      userId: user._id
    }, process.env.Access_Token);

    return res.status(200).json({
      success: true,
      message: `Sign-In Successfully: Welcome - ${username}`,
    })
  } catch (error) {
    console.log("ERROR: " + error)
    return res.status(400).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    })
  }

};

module.exports = { sign_in };
