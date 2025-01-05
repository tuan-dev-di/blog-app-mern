const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const { responseHelper } = require("../../utilities/ValidationUser");

const google_auth = async (req, res) => {
  const { email, name, photo } = req.body;
  const username = req.body.email;
  const usernamePrefix = username.split("@")[0];

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      const accessToken = jwt.sign(
        {
          userId: checkUser.uid,
          role: user.role,
        },
        process.env.Access_Token
      );

      const { password, ...user } = checkUser._doc;

      return responseHelper(
        res,
        200,
        true,
        `Welcome - ${checkUser.username}`,
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
    } else {
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
          role: user.role,
        },
        process.env.Access_Token
      );

      const { password, ...user } = newUser._doc;

      return responseHelper(
        res,
        200,
        true,
        `Welcome - ${newUser.username}`,
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
    }
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

module.exports = { google_auth };
