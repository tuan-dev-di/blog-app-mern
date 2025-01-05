const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const {
  checkEmptyUsername,
  checkEmptyPassword,
} = require("../../utilities/ValidationUser");
const { responseHelper } = require("../../utilities/ResponseHelper");

const sign_in = async (req, res) => {
  const { username, password } = req.body;

  if (checkEmptyUsername(username) || checkEmptyPassword(password))
    return responseHelper(
      res,
      400,
      false,
      "Username and Password are required"
    );

  try {
    const userValid = await User.findOne({ username });
    if (!userValid)
      return responseHelper(
        res,
        400,
        false,
        `Username: '${username}' does not existed`
      );

    const passwordCorrect = await argon2.verify(userValid.password, password);
    if (!passwordCorrect)
      return responseHelper(res, 400, false, "Password is incorrect");

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

    return responseHelper(
      res,
      200,
      true,
      `Welcome - ${username}`,
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

module.exports = { sign_in };
