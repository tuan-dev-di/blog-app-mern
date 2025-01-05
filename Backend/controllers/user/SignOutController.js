const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const { responseHelper } = require("../../utilities/ResponseHelper");

const sign_out = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    console.log("TOKEN:", token);

    if (!token)
      return responseHelper(
        res,
        401,
        false,
        "No token available. Please sign in"
      );

    const decodedToken = jwt.decode(token, process.env.Access_Token);
    const id = decodedToken.userId;
    // console.log("Decoded token:", decodedToken);
    // console.log("ID:", id);

    const user = await User.findById(id);
    if (!user) return responseHelper(res, 404, false, "User not found");

    return responseHelper(res, 200, true, `Sign out successfully`);
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

module.exports = { sign_out };
