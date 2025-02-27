const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const sign_out = async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (!token)
      return res.status(401).json({
        success: false,
        message: "No token available. Please sign in",
      });

    const decodedToken = jwt.decode(token, process.env.Access_Token);
    const id = decodedToken.userId;

    const user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res
      .status(200)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
      })
      .json({ success: true, message: `Sign out successfully` });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(400).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { sign_out };
