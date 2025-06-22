const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

const google_auth = async (req, res) => {
  const { email, name, photo } = req.body;
  const username = req.body.email;
  const usernamePrefix = username.split("@")[0]; // Create username from email before @ symbol with element at 0 position

  try {
    //? ---------------| CHECK USER EXISTED WITH GOOGLE |---------------
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      //? ---------------| CREATE A NEW TOKEN|---------------
      const accessToken = jwt.sign(
        {
          userId: checkUser._id,
          role: checkUser.role,
        },
        process.env.Access_Token,
        {
          expiresIn: "24h",
        }
      );

      const { password, ...user } = checkUser._doc;

      return res
        .status(200)
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
          // => 24 (hours) * 60 (minutes) * 60 (seconds) * 1000 (milliseconds)
          path: "/",
        })
        .json({
          success: true,
          message: "Sign in with Google Auth successfully!",
          user: user,
          accessToken: accessToken,
        });
    } else {
      //? ---------------| CREATE A RANDOM PASSWORD |---------------
      //* The function of automatically sending passwords to users has not been used
      const randomPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await argon2.hash(randomPassword);
      const newUser = new User({
        username: usernamePrefix,
        password: hashedPassword,
        email: email,
        displayName: name,
        profileImage: photo,
      });
      await newUser.save();

      const accessToken = jwt.sign(
        {
          userId: newUser.uid,
          role: newUser.role,
        },
        process.env.Access_Token,
        {
          expiresIn: "24h",
        }
      );

      const { password, ...user } = newUser._doc;
      return res
        .status(200)
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
          // => 24 (hours) * 60 (minutes) * 60 (seconds) * 1000 (milliseconds)
        })
        .json({
          success: true,
          // message: `Welcome - ${newUser.username}`,
          message: `Sign up successfully by Google Auth with - ${newUser.username}`,
          user: user,
          accessToken: accessToken,
        });
    }
  } catch (error) {
    console.log("Google Auth error:", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { google_auth };
